from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import json
import logging
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

# Initialize FastAPI app
app = FastAPI(title="Anomia LLM Backend", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development frontend
        "https://carriee-liuu.github.io",  # Production GitHub Pages
        "https://carriee-liuu.github.io/anomia-llm"  # Specific GitHub Pages URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
room_service = RoomService()
game_service = GameService(room_service)
llm_service = LLMService()

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
        logger.info(f"📨 Received WebSocket message: {message}")
        message_type = message.get("type")
        logger.info(f"🏷️ Message type: {message_type}")
        
        if message_type == "joinRoom":
            logger.info(f"🚀 Routing to handle_join_room")
            await handle_join_room(socket_id, room_code, message)
        elif message_type == "startGame":
            logger.info(f"🚀 Routing to handle_start_game")
            await handle_start_game(socket_id, room_code, message)
        elif message_type == "flipCard":
            logger.info(f"🚀 Routing to handle_flip_card")
            await handle_flip_card(socket_id, room_code, message)
        elif message_type == "submitAnswer":
            logger.info(f"🚀 Routing to handle_submit_answer")
            await handle_submit_answer(socket_id, room_code, message)
        elif message_type == "resolveFaceoff":
            logger.info(f"🚀 Routing to handle_resolve_faceoff")
            await handle_resolve_faceoff(socket_id, room_code, message)
        else:
            logger.warning(f"❓ Unknown message type: {message_type}")
            
    except Exception as e:
        logger.error(f"💥 Error handling message: {e}")
        await send_error(socket_id, str(e))

async def handle_join_room(socket_id: str, room_code: str, message: dict):
    """Handle player joining a room"""
    try:
        logger.info(f"🔍 handle_join_room called with: room_code={room_code}, socket_id={socket_id}, message={message}")
        
        player_name = message.get("playerName")
        if not player_name:
            logger.warning(f"❌ playerName missing from message: {message}")
            await send_error(socket_id, "playerName is required")
            return
        
        logger.info(f"🎯 Attempting to join player '{player_name}' to room '{room_code}'")
        
        result = room_service.join_room(room_code, socket_id, player_name)
        logger.info(f"📦 RoomService.join_room result: {result}")
        
        if result["success"]:
            logger.info(f"✅ Player {player_name} successfully joined room {room_code}")
            logger.info(f"📊 Room now has {len(result['room']['players'])} players")
            
            # Send confirmation to the joining player
            await send_message(socket_id, {
                "type": "roomJoined",
                "data": result
            })
            logger.info(f"📤 Sent roomJoined message to socket {socket_id}")
            
            # Notify all players in the room
            await broadcast_to_room(room_code, {
                "type": "playerJoined",
                "data": result
            })
            logger.info(f"📢 Broadcasted playerJoined to all players in room {room_code}")
            
            logger.info(f"🎉 Player {player_name} joined room {room_code} - COMPLETE")
        else:
            logger.error(f"❌ Failed to join room: {result['message']}")
            await send_error(socket_id, result["message"])
            
    except Exception as e:
        logger.error(f"💥 Error in handle_join_room: {e}")
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
            logger.info(f"📢 Broadcasting gameStarted to room {room_code}")
            await broadcast_to_room(room_code, {
                "type": "gameStarted",
                "data": result
            })
            logger.info(f"✅ Broadcast sent successfully for room {room_code}")
            
            logger.info(f"Game started successfully for room {room_code}")
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
            # Check if a faceoff was detected and send separate message
            game_state = result.get("gameState", {})
            if game_state.get("status") == "faceoff" and game_state.get("currentFaceoff"):
                logger.info(f"⚡ Faceoff detected! Broadcasting faceoffDetected message to room {room_code}")
                await broadcast_to_room(room_code, {
                    "type": "faceoffDetected",
                    "data": {
                        "faceoff": game_state["currentFaceoff"],
                        "gameState": game_state
                    }
                })
                logger.info(f"✅ faceoffDetected message broadcasted successfully")
            
            # Always broadcast the updated game state
            logger.info(f"📢 Broadcasting cardFlipped message to room {room_code}")
            logger.info(f"📢 Message data: {result}")
            await broadcast_to_room(room_code, {
                "type": "cardFlipped",
                "data": result
            })
            logger.info(f"✅ cardFlipped message broadcasted successfully")
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
        # Remove from active connections
        if socket_id in active_connections:
            del active_connections[socket_id]
        
        # Remove from room connections
        if room_code in room_connections and socket_id in room_connections[room_code]:
            room_connections[room_code].remove(socket_id)
            
        # Clean up empty rooms
        if room_code in room_connections and not room_connections[room_code]:
            del room_connections[room_code]
            
        logger.info(f"Cleaned up connection {socket_id} from room {room_code}")
        
    except Exception as e:
        logger.error(f"Error handling disconnect: {e}")

async def send_message(socket_id: str, message: dict):
    """Send a message to a specific WebSocket connection"""
    try:
        if socket_id in active_connections:
            await active_connections[socket_id].send_text(json.dumps(message))
    except Exception as e:
        logger.error(f"Error sending message to {socket_id}: {e}")

async def send_error(socket_id: str, error_message: str):
    """Send an error message to a specific WebSocket connection"""
    await send_message(socket_id, {
        "type": "error",
        "message": error_message
    })

async def broadcast_to_room(room_code: str, message: dict):
    """Broadcast a message to all players in a room"""
    logger.info(f"📢 broadcast_to_room called for room {room_code}")
    logger.info(f"📢 room_connections keys: {list(room_connections.keys())}")
    logger.info(f"📢 room_connections[{room_code}]: {room_connections.get(room_code, 'NOT FOUND')}")
    
    if room_code in room_connections:
        logger.info(f"📢 Broadcasting to {len(room_connections[room_code])} connections")
        for socket_id in room_connections[room_code]:
            logger.info(f"📢 Sending message to socket {socket_id}")
            await send_message(socket_id, message)
        logger.info(f"✅ Broadcast completed for room {room_code}")
    else:
        logger.warning(f"⚠️ Room {room_code} not found in room_connections")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=3001,
        reload=True,
        log_level="info"
    ) 