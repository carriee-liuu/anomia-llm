import uuid
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import json

logger = logging.getLogger(__name__)

class RoomService:
    """Service for managing game rooms and players"""
    
    def __init__(self):
        # In-memory storage for active rooms
        # In production, this would be Redis or a database
        self.active_rooms: Dict[str, Dict[str, Any]] = {}
        
        # Room configuration
        self.room_config = {
            "max_players": 8,
            "room_expiry_hours": 24,
            "cleanup_interval_minutes": 30
        }
        
        # Start cleanup timer
        self._start_cleanup_timer()
    
    def create_room(self, host_name: str) -> Dict[str, Any]:
        """Create a new game room"""
        try:
            # Generate unique room code
            room_code = self._generate_room_code()
            
            # Create room object
            room = {
                "roomCode": room_code,
                "hostName": host_name,
                "hostId": str(uuid.uuid4()),
                "players": [{
                    "id": str(uuid.uuid4()),
                    "name": host_name,
                    "isHost": True,
                    "joinedAt": datetime.now().isoformat(),
                    "socketId": None  # Will be set when host connects
                }],
                "status": "waiting",  # waiting, active, completed
                "createdAt": datetime.now().isoformat(),
                "lastActivity": datetime.now().isoformat(),
                "settings": {
                    "maxPlayers": self.room_config["max_players"],
                    "difficulty": "medium",
                    "rounds": 5,
                    "timeLimit": 30
                }
            }
            
            # Store room
            self.active_rooms[room_code] = room
            
            logger.info(f"Created room {room_code} for host {host_name}")
            
            return {
                "success": True,
                "room": room,
                "message": "Room created successfully"
            }
            
        except Exception as e:
            logger.error(f"Error creating room: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def join_room(self, room_code: str, socket_id: str, player_name: str) -> Dict[str, Any]:
        """Join an existing room"""
        try:
            room = self.active_rooms.get(room_code)
            
            if not room:
                return {
                    "success": False,
                    "message": "Room not found"
                }
            
            # Check if player name is already taken (including host reconnecting)
            # This check happens BEFORE status check to allow reconnection during active games
            existing_player = next((p for p in room["players"] if p["name"] == player_name), None)
            
            if existing_player:
                # Update existing player's socket ID (this handles reconnection even during active games)
                existing_player["socketId"] = socket_id
                room["lastActivity"] = datetime.now().isoformat()
                
                logger.info(f"Player {player_name} reconnected to room {room_code} (game status: {room['status']})")
                
                return {
                    "success": True,
                    "room": room,
                    "player": existing_player,
                    "message": "Successfully reconnected to room"
                }
            
            # For NEW players, block joining if game is not waiting
            if room["status"] != "waiting":
                return {
                    "success": False,
                    "message": "Game already in progress"
                }
            
            if len(room["players"]) >= room["settings"]["maxPlayers"]:
                return {
                    "success": False,
                    "message": "Room is full"
                }
            
            # Add new player to room
            new_player = {
                "id": str(uuid.uuid4()),
                "name": player_name,
                "isHost": False,
                "joinedAt": datetime.now().isoformat(),
                "socketId": socket_id
            }
            
            room["players"].append(new_player)
            room["lastActivity"] = datetime.now().isoformat()
            
            # Update room
            self.active_rooms[room_code] = room
            
            logger.info(f"Player {player_name} joined room {room_code}")
            
            return {
                "success": True,
                "room": room,
                "player": new_player,
                "message": "Successfully joined room"
            }
            
        except Exception as e:
            logger.error(f"Error joining room: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_room(self, room_code: str) -> Optional[Dict[str, Any]]:
        """Get room information"""
        try:
            room = self.active_rooms.get(room_code)
            if room:
                # Update last activity
                room["lastActivity"] = datetime.now().isoformat()
                return room
            return None
        except Exception as e:
            logger.error(f"Error getting room: {e}")
            return None
    
    def leave_room(self, room_code: str, socket_id: str) -> bool:
        """Remove a player from a room"""
        try:
            room = self.active_rooms.get(room_code)
            if not room:
                return False
            
            # Find the leaving player
            leaving_player = None
            for p in room["players"]:
                if p.get("socketId") == socket_id:
                    leaving_player = p
                    break
            
            # Check if leaving player is the host
            was_host = leaving_player and leaving_player.get("isHost", False)
            
            # Remove the player
            room["players"] = [p for p in room["players"] if p.get("socketId") != socket_id]
            room["lastActivity"] = datetime.now().isoformat()
            
            # If host left and there are remaining players, transfer host to first player
            if was_host and len(room["players"]) > 0:
                room["players"][0]["isHost"] = True
                room["hostId"] = room["players"][0]["id"]
                room["hostName"] = room["players"][0]["name"]
                logger.info(f"Transferred host role to {room['players'][0]['name']} in room {room_code}")
            # If no players left, mark room for cleanup
            elif len(room["players"]) == 0:
                room["status"] = "abandoned"
            
            logger.info(f"Player left room {room_code}")
            return True
            
        except Exception as e:
            logger.error(f"Error leaving room: {e}")
            return False
    
    def update_player_socket(self, room_code: str, player_name: str, new_socket_id: str) -> bool:
        """Update a player's socket ID (for reconnections)"""
        try:
            room = self.active_rooms.get(room_code)
            if not room:
                return False
            
            # Find and update player
            for player in room["players"]:
                if player["name"] == player_name:
                    player["socketId"] = new_socket_id
                    room["lastActivity"] = datetime.now().isoformat()
                    logger.info(f"Updated socket for player {player_name} in room {room_code}")
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error updating player socket: {e}")
            return False
    
    def cleanup_expired_rooms(self) -> int:
        """Remove rooms that have expired"""
        try:
            current_time = datetime.now()
            expired_rooms = []
            
            for room_code, room in self.active_rooms.items():
                last_activity = datetime.fromisoformat(room["lastActivity"])
                if current_time - last_activity > timedelta(hours=self.room_config["room_expiry_hours"]):
                    expired_rooms.append(room_code)
            
            # Remove expired rooms
            for room_code in expired_rooms:
                del self.active_rooms[room_code]
                logger.info(f"Cleaned up expired room {room_code}")
            
            if expired_rooms:
                logger.info(f"Cleaned up {len(expired_rooms)} expired rooms")
            
            return len(expired_rooms)
            
        except Exception as e:
            logger.error(f"Error cleaning up expired rooms: {e}")
            return 0
    
    def get_room_stats(self) -> Dict[str, Any]:
        """Get statistics about active rooms"""
        try:
            total_rooms = len(self.active_rooms)
            total_players = sum(len(room["players"]) for room in self.active_rooms.values())
            waiting_rooms = len([r for r in self.active_rooms.values() if r["status"] == "waiting"])
            active_rooms = len([r for r in self.active_rooms.values() if r["status"] == "active"])
            
            return {
                "totalRooms": total_rooms,
                "totalPlayers": total_players,
                "waitingRooms": waiting_rooms,
                "activeRooms": active_rooms,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting room stats: {e}")
            return {}
    
    def _generate_room_code(self) -> str:
        """Generate a unique 6-character room code"""
        import random
        import string
        
        while True:
            # Generate 6-character code
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            
            # Check if code already exists
            if code not in self.active_rooms:
                return code
    
    def _start_cleanup_timer(self):
        """Start periodic cleanup of expired rooms"""
        import asyncio
        import threading
        
        def cleanup_loop():
            while True:
                try:
                    # Sleep for cleanup interval
                    import time
                    time.sleep(self.room_config["cleanup_interval_minutes"] * 60)
                    
                    # Clean up expired rooms
                    self.cleanup_expired_rooms()
                    
                except Exception as e:
                    logger.error(f"Error in cleanup loop: {e}")
        
        # Start cleanup thread
        cleanup_thread = threading.Thread(target=cleanup_loop, daemon=True)
        cleanup_thread.start()
        logger.info("Started room cleanup timer") 