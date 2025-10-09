import uuid
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
import random

from models.game_models import Game, Player, Card, CardShape, GameStatus, GameEvent, Faceoff
from services.room_service import RoomService

logger = logging.getLogger(__name__)

class GameService:
    """Service for managing game logic and state"""
    
    def __init__(self, room_service):
        # Reference to RoomService for getting room information
        self.room_service = room_service
        
        # In-memory storage for active games
        # In production, this would be Redis or a database
        self.active_games: Dict[str, Game] = {}
        
        # Game configuration
        self.game_config = {
            "cards_per_player": 5,
            "match_threshold": 2,  # How many matching cards trigger a face-off
            "round_time_limit": 30000,  # 30 seconds per round
            "points_per_win": 1
        }
        
        # Available shapes for Anomia cards
        self.shapes = ["circle", "square", "triangle", "diamond", "star", "heart", "hexagon", "pentagon"]
        
        # Sample categories for each shape
        self.categories_by_shape = {
            "circle": ["Pizza", "Wheel", "Coin", "Button", "Clock"],
            "square": ["Box", "Window", "Book", "Table", "Picture"],
            "triangle": ["Pyramid", "Roof", "Flag", "Slice", "Mountain"],
            "diamond": ["Ring", "Crystal", "Baseball", "Kite", "Gem"],
            "star": ["Flag", "Award", "Flower", "Snowflake", "Compass"],
            "heart": ["Valentine", "Organ", "Emoji", "Card", "Candy"],
            "hexagon": ["Honeycomb", "Nut", "Crystal", "Stop Sign", "Bolt"],
            "pentagon": ["Building", "Shield", "Flower", "Star", "Coin"]
        }
    
    def start_game(self, room_code: str) -> Dict[str, Any]:
        """Start a new game in a room"""
        try:
            # Get room information from RoomService
            room = self.room_service.get_room(room_code)
            if not room:
                return {
                    "success": False,
                    "error": "Room not found"
                }
            
            # Check if game is already active
            if room_code in self.active_games:
                return {
                    "success": False,
                    "error": "Game already in progress"
                }
            
            # Create game object
            game = Game(
                room_code=room_code,
                status=GameStatus.ACTIVE,
                current_round=1,
                started_at=datetime.now()
            )
            
            # Convert room players to game players
            for room_player in room["players"]:
                player = Player(
                    id=room_player["id"],
                    name=room_player["name"],
                    is_host=room_player.get("isHost", False),
                    score=0,
                    deck=[],
                    is_ready=False,
                    socket_id=room_player.get("socketId"),
                    has_flipped_this_turn=False
                )
                game.add_player(player)
            
            # Generate initial deck
            game.deck = self._generate_initial_deck(len(room["players"]))
            
            # In Anomia, players start with empty decks and get cards by flipping
            # No initial card dealing - players flip cards during their turns
            
            # Set the first player's turn
            game.set_initial_turn()
            
            # Store game state
            self.active_games[room_code] = game
            
            # Update room status
            room["status"] = "active"
            
            logger.info(f"Game started successfully for room {room_code}")
            
            return {
                "success": True,
                "gameState": game.to_dict(),
                "message": "Game started successfully"
            }
            
        except Exception as e:
            logger.error(f"Error starting game: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def flip_card(self, room_code: str, player_id: str) -> Dict[str, Any]:
        """Handle card flipping - core game mechanic"""
        try:
            game = self.active_games.get(room_code)
            if not game:
                return {
                    "success": False,
                    "error": "Game not found"
                }
            
            player = game.get_player(player_id)
            if not player:
                return {
                    "success": False,
                    "error": "Player not found"
                }
            
            # Check if it's the player's turn
            if not game.is_player_turn(player_id):
                return {
                    "success": False,
                    "error": f"It's not {player.name}'s turn. Current turn: {game.current_player_id}"
                }
            
            # Check if player already flipped this turn (one card per turn)
            if player.has_flipped_this_turn:
                return {
                    "success": False,
                    "error": f"{player.name} has already flipped a card this turn"
                }
            
            # Draw a new card for the player
            if len(game.deck) == 0:
                # Reshuffle deck if empty
                game.deck = self._generate_initial_deck(len(game.players))
            
            new_card = game.deck.pop()
            player.add_card_to_deck(new_card)
            player.has_flipped_this_turn = True
            
            # Add card flip event
            game.add_event(GameEvent(
                event_type="card_flipped",
                player_id=player_id,
                data={"card": new_card.to_dict()}
            ))
            
            # Check for faceoffs after card flip
            faceoffs = game.find_matching_players(player_id)
            if faceoffs:
                # Start faceoff if matches found
                game.current_faceoff = faceoffs[0]
                game.status = GameStatus.FACEOFF
                logger.info(f"Faceoff started between {faceoffs[0].player1_id} and {faceoffs[0].player2_id}")
            else:
                # No faceoff - advance turn automatically
                next_player = game.next_turn()
                if next_player:
                    logger.info(f"Turn advanced to {next_player.name} after {player.name} flipped card")
            
            logger.info(f"Card flipped for player {player.name} in room {room_code}")
            
            return {
                "success": True,
                "gameState": game.to_dict(),
                "message": "Card flipped successfully"
            }
            
        except Exception as e:
            logger.error(f"Error flipping card: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def advance_turn(self, room_code: str) -> Dict[str, Any]:
        """Advance to the next player's turn"""
        try:
            game = self.active_games.get(room_code)
            if not game:
                return {
                    "success": False,
                    "error": "Game not found"
                }
            
            # Reset current player's turn flag for next turn
            if game.current_player_id:
                current_player = game.get_player(game.current_player_id)
                if current_player:
                    current_player.reset_turn_flag()
            
            # Advance to next player
            next_player = game.next_turn()
            
            if not next_player:
                return {
                    "success": False,
                    "error": "No players found"
                }
            
            logger.info(f"Turn advanced to player {next_player.name} in room {room_code}")
            
            return {
                "success": True,
                "gameState": game.to_dict(),
                "message": f"Turn passed to {next_player.name}"
            }
            
        except Exception as e:
            logger.error(f"Error advancing turn: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def submit_answer(self, room_code: str, player_id: str, answer: str, category: str) -> Dict[str, Any]:
        """Handle answer submission during face-offs"""
        try:
            game = self.active_games.get(room_code)
            if not game:
                return {
                    "success": False,
                    "error": "Game not found"
                }
            
            player = game.get_player(player_id)
            if not player:
                return {
                    "success": False,
                    "error": "Player not found"
                }
            
            # Validate answer (this is where you'd integrate with LLM service)
            is_valid = self._validate_answer(answer, category)
            
            if is_valid:
                # Award points
                player.score += self.game_config["points_per_win"]
                
                # Update game state
                game.last_activity = datetime.now()
                
                logger.info(f"Player {player.name} got a point for answer: {answer}")
                
                return {
                    "success": True,
                    "gameState": game.to_dict(),
                    "isValidAnswer": True,
                    "playerId": player_id,
                    "message": "Answer accepted! +1 point"
                }
            else:
                return {
                    "success": True,
                    "gameState": game.to_dict(),
                    "isValidAnswer": False,
                    "playerId": player_id,
                    "message": "Answer not accepted"
                }
                
        except Exception as e:
            logger.error(f"Error submitting answer: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_game_state(self, room_code: str) -> Optional[Dict[str, Any]]:
        """Get current game state"""
        game = self.active_games.get(room_code)
        return game.to_dict() if game else None
    
    def end_game(self, room_code: str) -> bool:
        """End a game and clean up"""
        try:
            if room_code in self.active_games:
                game = self.active_games[room_code]
                game.status = GameStatus.COMPLETED
                game.ended_at = datetime.now()
                
                # Calculate final scores
                final_scores = [
                    {
                        "playerId": player.id,
                        "name": player.name,
                        "finalScore": player.score
                    }
                    for player in game.players
                ]
                
                # Sort by score (highest first)
                final_scores.sort(key=lambda x: x["finalScore"], reverse=True)  # type: ignore
                
                game.final_scores = final_scores
                game.winner = final_scores[0] if final_scores else None
                
                logger.info(f"Game ended for room {room_code}. Winner: {game.winner['name'] if game.winner else 'None'}")
                
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error ending game: {e}")
            return False
    
    def _generate_initial_deck(self, player_count: int) -> List[Card]:
        """Generate initial deck of Anomia cards with shapes and categories"""
        deck_size = player_count * self.game_config["cards_per_player"] * 2  # Extra cards for variety
        
        deck = []
        for i in range(deck_size):
            # Select a random shape
            shape_name = random.choice(self.shapes)
            shape = CardShape(shape_name)
            # Select a random category for that shape
            category = random.choice(self.categories_by_shape[shape_name])
            
            card = Card(
                id=str(uuid.uuid4()),
                shape=shape,
                category=category,
                difficulty="medium"
            )
            deck.append(card)
        
        # Shuffle deck
        return self._shuffle_deck(deck)
    
    def _deal_cards(self, game: Game):
        """Deal cards to players - NOT USED in Anomia game"""
        # In Anomia, players start with empty decks and get cards by flipping
        # This function is kept for potential future use but not called
        for player in game.players:
            for i in range(self.game_config["cards_per_player"]):
                if len(game.deck) > 0:
                    card = game.deck.pop()
                    player.add_card_to_deck(card)
    
    def _shuffle_deck(self, deck: List[Card]) -> List[Card]:
        """Shuffle deck using Fisher-Yates algorithm"""
        shuffled = deck.copy()
        for i in range(len(shuffled) - 1, 0, -1):
            j = random.randint(0, i)
            shuffled[i], shuffled[j] = shuffled[j], shuffled[i]
        return shuffled
    
    def _find_matches(self, game: Game, current_player_id: str) -> List[Faceoff]:
        """Find matching shapes between players (Anomia faceoff trigger)"""
        return game.find_matching_players(current_player_id)
    
    def resolve_faceoff(self, room_code: str, loser_id: str) -> Dict[str, Any]:
        """Resolve a faceoff when loser swipes up on their card"""
        try:
            game = self.active_games.get(room_code)
            if not game:
                return {"success": False, "error": "Game not found"}
            
            # Use the game's resolve_faceoff method
            result = game.resolve_faceoff(loser_id)
            if not result:
                return {"success": False, "error": "Could not resolve faceoff"}
            
            # Reset both players' turn flags after faceoff
            winner = game.get_player(result['winner']['id'])
            loser = game.get_player(result['loser']['id'])
            if winner:
                winner.reset_turn_flag()
            if loser:
                loser.reset_turn_flag()
            
            # Advance turn after faceoff resolution (simple: just go to next player)
            next_player = game.next_turn()
            if next_player:
                result['nextPlayer'] = next_player.to_dict()
                result['message'] = f"Faceoff resolved! {result['winner']['name']} won. Turn passed to {next_player.name}"
            else:
                result['message'] = f"Faceoff resolved! {result['winner']['name']} won."
            
            # Update the game state with the new turn information
            result['gameState'] = game.to_dict()
            
            logger.info(f"Faceoff resolved: {result['winner']['name']} won, {result['loser']['name']} lost")
            
            return {
                "success": True,
                **result
            }
            
        except Exception as e:
            logger.error(f"Error resolving faceoff: {e}")
            return {"success": False, "error": str(e)}
    
    def _validate_answer(self, answer: str, category: str) -> bool:
        """Validate if an answer is correct for a category"""
        # This is a placeholder - in production, you'd integrate with LLM service
        # For now, just check if answer is not empty and reasonable length
        if not answer or len(answer.strip()) < 2:
            return False
        
        # You could add more sophisticated validation here
        # For example, checking against a list of known valid answers
        # Or using the LLM service to validate the answer
        
        return True
    
    def get_game_stats(self) -> Dict[str, Any]:
        """Get game statistics for monitoring"""
        active_games = len(self.active_games)
        total_players = sum(len(game.players) for game in self.active_games.values())
        completed_games = len([g for g in self.active_games.values() if g.status == GameStatus.COMPLETED])
        
        return {
            "activeGames": active_games,
            "totalPlayers": total_players,
            "completedGames": completed_games,
            "timestamp": datetime.now().isoformat()
        } 