from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import json
import logging
import os
from typing import Dict, List, Optional
import uuid
from datetime import datetime

from services.room_service import RoomService
from services.game_service import GameService
from services.llm_service import LLMService
from models.game_models import GameStatus

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get allowed origins from environment or use defaults
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
allowed_origins = [
    "http://localhost:3000",  # Local development
    "https://carriee-liuu.github.io",  # GitHub Pages production (both with and without path)
]

# Remove duplicates while preserving order
seen = set()
allowed_origins = [x for x in allowed_origins if not (x in seen or seen.add(x))]

# Add FRONTEND_URL if it's not already in the list
if FRONTEND_URL not in allowed_origins:
    allowed_origins.append(FRONTEND_URL)

logger.info(f"🌐 CORS allowed origins: {allowed_origins}")
logger.info(f"🌐 FRONTEND_URL from env: {FRONTEND_URL}")

# Initialize FastAPI app
app = FastAPI(title="Anomia LLM Backend", version="1.0.0")

# Add CORS middleware - MUST be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    expose_headers=["*"],
    max_age=3600,
)

# Initialize services
room_service = RoomService()
llm_service = LLMService()
game_service = GameService(room_service, llm_service)

# Store active WebSocket connections
active_connections: Dict[str, WebSocket] = {}
room_connections: Dict[str, List[str]] = {}  # room_code -> [socket_ids]

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "message": "Anomia LLM Python Backend Running",
        "timestamp": datetime.now().isoformat()
    }

# LLM service status endpoint
@app.get("/llm/status")
async def llm_status():
    """Get LLM service status and configuration"""
    return llm_service.get_service_status()

# Test LLM category generation endpoint
@app.get("/llm/test-categories")
async def test_llm_categories(count: int = 5):
    """Test LLM category generation"""
    try:
        categories = llm_service.generate_categories_for_game(count)
        return {
            "success": True,
            "categories": categories,
            "count": len(categories)
        }
    except Exception as e:
        logger.error(f"Error testing LLM categories: {e}")
        return {
            "success": False,
            "error": str(e),
            "fallback_categories": llm_service._generate_fallback_categories(count)
        }

# Explicit OPTIONS handler for CORS preflight (backup)
@app.options("/api/rooms")
async def options_rooms(request: Request):
    """Handle CORS preflight for /api/rooms"""
    origin = request.headers.get("origin")
    if origin in allowed_origins:
        return JSONResponse(
            content={},
            headers={
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Max-Age": "3600",
            }
        )
    return JSONResponse(content={}, status_code=403)

@app.options("/api/rooms/{room_code}")
async def options_room_code(room_code: str, request: Request):
    """Handle CORS preflight for /api/rooms/{room_code}"""
    origin = request.headers.get("origin")
    if origin in allowed_origins:
        return JSONResponse(
            content={},
            headers={
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Max-Age": "3600",
            }
        )
    return JSONResponse(content={}, status_code=403)

# API Routes
@app.post("/api/rooms")
async def create_room(request: dict):
    """Create a new game room via HTTP API"""
    try:
        host_name = request.get("hostName")
        if not host_name:
            raise HTTPException(status_code=400, detail="hostName is required")
        
        result = room_service.create_room(host_name)
        logger.info(f"Created room {result['room']['roomCode']} for host {host_name}")
        
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Error creating room: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/rooms/{room_code}")
async def get_room(room_code: str):
    """Get room information via HTTP API"""
    try:
        room = room_service.get_room(room_code)
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        return JSONResponse(content=room)
    except Exception as e:
        logger.error(f"Error getting room: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# WebSocket endpoint
@app.websocket("/ws/{room_code}")
async def websocket_endpoint(websocket: WebSocket, room_code: str):
    """Handle WebSocket connections for real-time game communication"""
    await websocket.accept()
    
    # Generate unique socket ID
    socket_id = str(uuid.uuid4())
    active_connections[socket_id] = websocket
    
    # Initialize room connections if needed
    if room_code not in room_connections:
        room_connections[room_code] = []
    room_connections[room_code].append(socket_id)
    
    logger.info(f"WebSocket connected: {socket_id} to room {room_code}")
    
    try:
        while True:
            # Wait for messages from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            await handle_websocket_message(socket_id, room_code, message)
            
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: {socket_id}")
        await handle_disconnect(socket_id, room_code)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await handle_disconnect(socket_id, room_code)

async def handle_websocket_message(socket_id: str, room_code: str, message: dict):
    """Handle incoming WebSocket messages"""
    try:
        message_type = message.get("type")
        
        if message_type == "joinRoom":
            await handle_join_room(socket_id, room_code, message)
        elif message_type == "startGame":
            await handle_start_game(socket_id, room_code, message)
        elif message_type == "flipCard":
            await handle_flip_card(socket_id, room_code, message)
        elif message_type == "submitAnswer":
            await handle_submit_answer(socket_id, room_code, message)
        elif message_type == "resolveFaceoff":
            await handle_resolve_faceoff(socket_id, room_code, message)
        elif message_type == "leaveRoom":
            await handle_leave_room(socket_id, room_code, message)
        else:
            logger.warning(f"Unknown message type: {message_type}")
            
    except Exception as e:
        logger.error(f"Error handling message: {e}")
        await send_error(socket_id, str(e))

async def handle_join_room(socket_id: str, room_code: str, message: dict):
    """Handle player joining a room"""
    try:
        player_name = message.get("playerName")
        if not player_name:
            await send_error(socket_id, "playerName is required")
            return
        
        result = room_service.join_room(room_code, socket_id, player_name)
        
        if result["success"]:
            logger.info(f"Player {player_name} joined/reconnected to room {room_code}")
            
            # Ensure socket is in room_connections
            if room_code not in room_connections:
                room_connections[room_code] = []
            if socket_id not in room_connections[room_code]:
                room_connections[room_code].append(socket_id)
            
            # Send confirmation to the joining player
            await send_message(socket_id, {
                "type": "roomJoined",
                "data": result
            })
            
            # Notify all players in the room
            await broadcast_to_room(room_code, {
                "type": "playerJoined",
                "data": result
            })
        else:
            logger.warning(f"Failed to join room: {result['message']}")
            await send_error(socket_id, result["message"])
            
    except Exception as e:
        logger.error(f"Error in handle_join_room: {e}")
        await send_error(socket_id, str(e))

async def handle_leave_room(socket_id: str, room_code: str, message: dict):
    """Handle player leaving a room"""
    try:
        # Remove player from room
        success = room_service.leave_room(room_code, socket_id)
        
        if success:
            logger.info(f"Player left room {room_code}")
            
            # Get updated room data
            room = room_service.get_room(room_code)
            if room:
                # Broadcast player left message to all remaining players
                await broadcast_to_room(room_code, {
                    "type": "playerLeft",
                    "data": {
                        "room": room,
                        "players": room["players"]
                    }
                })
        else:
            logger.warning(f"Failed to leave room {room_code} for socket {socket_id}")
            
    except Exception as e:
        logger.error(f"Error in handle_leave_room: {e}")
        await send_error(socket_id, str(e))

async def handle_start_game(socket_id: str, room_code: str, message: dict):
    """Handle starting a game"""
    try:
        logger.info(f"Starting game for room: {room_code}")
        
        # Check if player is host
        room = room_service.get_room(room_code)
        if not room:
            await send_error(socket_id, "Room not found")
            return
        
        # Start the game
        result = game_service.start_game(room_code)
        
        if result["success"]:
            # Broadcast game started to all players in the room
            await broadcast_to_room(room_code, {
                "type": "gameStarted",
                "data": result
            })
            logger.info(f"Game started for room {room_code}")
        else:
            await send_error(socket_id, result["error"])
            
    except Exception as e:
        logger.error(f"Error starting game: {e}")
        await send_error(socket_id, str(e))

async def handle_flip_card(socket_id: str, room_code: str, message: dict):
    """Handle card flipping"""
    try:
        player_id = message.get("playerId")
        if not player_id:
            await send_error(socket_id, "playerId is required")
            return
        
        result = game_service.flip_card(room_code, player_id)
        
        if result["success"]:
            # Check if game ended (deck ran out)
            if result.get("gameEnded"):
                logger.info(f"Game ended for room {room_code}")
                await broadcast_to_room(room_code, {
                    "type": "gameEnded",
                    "data": result
                })
                return
            
            # Check if a faceoff was detected and send separate message
            game_state = result.get("gameState", {})
            if game_state.get("status") == "faceoff" and game_state.get("currentFaceoff"):
                await broadcast_to_room(room_code, {
                    "type": "faceoffDetected",
                    "data": {
                        "faceoff": game_state["currentFaceoff"],
                        "gameState": game_state
                    }
                })
            
            # Always broadcast the updated game state
            await broadcast_to_room(room_code, {
                "type": "cardFlipped",
                "data": result
            })
        else:
            await send_error(socket_id, result["error"])
            
    except Exception as e:
        logger.error(f"Error flipping card: {e}")
        await send_error(socket_id, str(e))

async def handle_submit_answer(socket_id: str, room_code: str, message: dict):
    """Handle answer submission"""
    try:
        player_id = message.get("playerId")
        answer = message.get("answer")
        category = message.get("category")
        
        if not all([player_id, answer, category]):
            await send_error(socket_id, "playerId, answer, and category are required")
            return
        
        result = game_service.submit_answer(room_code, str(player_id), str(answer), str(category))
        
        if result["success"]:
            await broadcast_to_room(room_code, {
                "type": "answerSubmitted",
                "data": result
            })
        else:
            await send_error(socket_id, result["error"])
            
    except Exception as e:
        logger.error(f"Error submitting answer: {e}")
        await send_error(socket_id, str(e))

async def handle_resolve_faceoff(socket_id: str, room_code: str, message: dict):
    """Handle faceoff resolution when loser swipes up"""
    try:
        loser_id = message.get("loserId")
        if not loser_id:
            await send_error(socket_id, "loserId is required")
            return
        
        result = game_service.resolve_faceoff(room_code, loser_id)
        
        if result["success"]:
            # Broadcast faceoff resolved to all players
            await broadcast_to_room(room_code, {
                "type": "faceoffResolved",
                "data": result
            })
        else:
            await send_error(socket_id, result["error"])
            
    except Exception as e:
        logger.error(f"Error resolving faceoff: {e}")
        await send_error(socket_id, str(e))

async def handle_disconnect(socket_id: str, room_code: str):
    """Handle WebSocket disconnection"""
    try:
        # Get room to check game status
        room = room_service.get_room(room_code)
        
        # Remove from active connections
        if socket_id in active_connections:
            del active_connections[socket_id]
        
        # Remove from room connections (but keep player in room for reconnection)
        if room_code in room_connections and socket_id in room_connections[room_code]:
            room_connections[room_code].remove(socket_id)
        
        # Only remove player from room if game is not active (allows reconnection during game)
        if room and room.get("status") == "waiting":
            # Remove player from room only if in lobby
            success = room_service.leave_room(room_code, socket_id)
            if success and room_connections.get(room_code):
                # Broadcast player left message to all remaining players
                updated_room = room_service.get_room(room_code)
                if updated_room:
                    await broadcast_to_room(room_code, {
                        "type": "playerLeft",
                        "data": {
                            "room": updated_room,
                            "players": updated_room["players"]
                        }
                    })
        else:
            # During active game, just mark socket as disconnected (player can reconnect)
            logger.info(f"Player disconnected during active game in room {room_code}, allowing reconnection")
            
        # Clean up empty rooms
        if room_code in room_connections and not room_connections[room_code]:
            del room_connections[room_code]
            
    except Exception as e:
        logger.error(f"Error handling disconnect: {e}")

async def send_message(socket_id: str, message: dict):
    """Send a message to a specific WebSocket connection"""
    try:
        if socket_id in active_connections:
            await active_connections[socket_id].send_text(json.dumps(message))
        else:
            logger.debug(f"Socket {socket_id} not in active_connections, message not sent")
    except Exception as e:
        logger.warning(f"Error sending message to {socket_id}: {e}")
        # Remove from active connections if send fails
        if socket_id in active_connections:
            del active_connections[socket_id]

async def send_error(socket_id: str, error_message: str):
    """Send an error message to a specific WebSocket connection"""
    await send_message(socket_id, {
        "type": "error",
        "message": error_message
    })

async def broadcast_to_room(room_code: str, message: dict):
    """Broadcast a message to all players in a room"""
    if room_code in room_connections:
        disconnected_sockets = []
        for socket_id in room_connections[room_code]:
            try:
                await send_message(socket_id, message)
            except Exception as e:
                logger.warning(f"Failed to send message to socket {socket_id}: {e}")
                disconnected_sockets.append(socket_id)
        
        # Remove disconnected sockets from room_connections
        for socket_id in disconnected_sockets:
            if room_code in room_connections:
                room_connections[room_code] = [s for s in room_connections[room_code] if s != socket_id]
                logger.info(f"Removed disconnected socket {socket_id} from room {room_code}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=3001,
        reload=True,
        log_level="info"
    ) 