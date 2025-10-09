from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class GameStatus(Enum):
    WAITING = "waiting"
    ACTIVE = "active"
    FACEOFF = "faceoff"
    COMPLETED = "completed"


class CardShape(Enum):
    CIRCLE = "circle"
    SQUARE = "square"
    TRIANGLE = "triangle"
    DIAMOND = "diamond"
    STAR = "star"
    HEART = "heart"
    HEXAGON = "hexagon"
    PENTAGON = "pentagon"


@dataclass
class Card:
    """Represents a single Anomia card"""
    id: str
    shape: CardShape
    category: str
    difficulty: str = "medium"
    timestamp: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            "id": self.id,
            "shape": self.shape.value,
            "category": self.category,
            "difficulty": self.difficulty,
            "timestamp": self.timestamp.isoformat()
        }


@dataclass
class Player:
    """Represents a player in the game"""
    id: str
    name: str
    is_host: bool = False
    score: int = 0
    deck: List[Card] = field(default_factory=list)  # Player's individual deck of cards
    is_ready: bool = False
    socket_id: Optional[str] = None
    has_flipped_this_turn: bool = False  # Track if player has flipped this turn
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            "id": self.id,
            "name": self.name,
            "isHost": self.is_host,
            "score": self.score,
            "deck": [card.to_dict() for card in self.deck],
            "isReady": self.is_ready,
            "socketId": self.socket_id,
            "hasFlippedThisTurn": self.has_flipped_this_turn
        }
    
    def add_card_to_deck(self, card: Card) -> None:
        """Add a new card to the player's deck"""
        self.deck.append(card)
    
    def get_top_card(self) -> Optional[Card]:
        """Get the top card from the player's deck"""
        return self.deck[-1] if self.deck else None
    
    def remove_top_card(self) -> Optional[Card]:
        """Remove and return the top card from the player's deck"""
        return self.deck.pop() if self.deck else None
    
    def has_cards(self) -> bool:
        """Check if player has any cards in their deck"""
        return len(self.deck) > 0
    
    def reset_turn_flag(self) -> None:
        """Reset the has_flipped_this_turn flag for next turn"""
        self.has_flipped_this_turn = False


@dataclass
class Faceoff:
    """Represents a faceoff between two players"""
    player1_id: str
    player2_id: str
    shape: CardShape
    player1_card: Card
    player2_card: Card
    timestamp: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            "player1": self.player1_id,
            "player2": self.player2_id,
            "shape": self.shape.value,
            "player1Card": self.player1_card.to_dict(),
            "player2Card": self.player2_card.to_dict(),
            "timestamp": self.timestamp.isoformat()
        }


@dataclass
class GameEvent:
    """Represents a game event for history tracking"""
    event_type: str
    player_id: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    timestamp: datetime = field(default_factory=datetime.now)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            "type": self.event_type,
            "playerId": self.player_id,
            "data": self.data,
            "timestamp": self.timestamp.isoformat()
        }


@dataclass
class Game:
    """Main game state object"""
    room_code: str
    status: GameStatus = GameStatus.WAITING
    current_round: int = 1
    players: List[Player] = field(default_factory=list)
    deck: List[Card] = field(default_factory=list)
    current_faceoff: Optional[Faceoff] = None
    current_player_id: Optional[str] = None  # Track whose turn it is
    current_player_index: int = 0  # Index in players list for turn order
    game_history: List[GameEvent] = field(default_factory=list)
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    last_activity: datetime = field(default_factory=datetime.now)
    final_scores: Optional[List[Dict[str, Any]]] = None
    winner: Optional[Dict[str, Any]] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            "roomCode": self.room_code,
            "status": self.status.value,
            "currentRound": self.current_round,
            "players": [player.to_dict() for player in self.players],
            "deck": [card.to_dict() for card in self.deck],
            "currentFaceoff": self.current_faceoff.to_dict() if self.current_faceoff else None,
            "currentPlayerId": self.current_player_id,
            "currentPlayerIndex": self.current_player_index,
            "gameHistory": [event.to_dict() for event in self.game_history],
            "startedAt": self.started_at.isoformat() if self.started_at else None,
            "endedAt": self.ended_at.isoformat() if self.ended_at else None,
            "lastActivity": self.last_activity.isoformat(),
            "finalScores": self.final_scores,
            "winner": self.winner
        }
    
    def get_player(self, player_id: str) -> Optional[Player]:
        """Get a player by ID"""
        return next((p for p in self.players if p.id == player_id), None)
    
    def get_player_by_name(self, name: str) -> Optional[Player]:
        """Get a player by name"""
        return next((p for p in self.players if p.name == name), None)
    
    def add_player(self, player: Player) -> None:
        """Add a player to the game"""
        self.players.append(player)
        self.last_activity = datetime.now()
    
    def remove_player(self, player_id: str) -> bool:
        """Remove a player from the game"""
        for i, player in enumerate(self.players):
            if player.id == player_id:
                del self.players[i]
                self.last_activity = datetime.now()
                return True
        return False
    
    def add_event(self, event: GameEvent) -> None:
        """Add an event to game history"""
        self.game_history.append(event)
        self.last_activity = datetime.now()
    
    def find_matching_players(self, current_player_id: str) -> List[Faceoff]:
        """Find players with matching shapes"""
        current_player = self.get_player(current_player_id)
        if not current_player or not current_player.has_cards():
            return []
        
        faceoffs = []
        current_top_card = current_player.get_top_card()
        if not current_top_card:
            return []
        
        current_shape = current_top_card.shape
        
        for other_player in self.players:
            if (other_player.id != current_player_id and 
                other_player.has_cards()):
                
                other_top_card = other_player.get_top_card()
                if other_top_card and other_top_card.shape == current_shape:
                    faceoffs.append(Faceoff(
                        player1_id=current_player_id,
                        player2_id=other_player.id,
                        shape=current_shape,
                        player1_card=current_top_card,
                        player2_card=other_top_card
                    ))
        
        return faceoffs
    
    def resolve_faceoff(self, loser_id: str) -> Optional[Dict[str, Any]]:
        if not self.current_faceoff:
            return None
        
        loser = self.get_player(loser_id)
        if not loser or not loser.has_cards():
            return None
        
        # Find the winner (the other player in the faceoff)
        winner_id = (self.current_faceoff.player1_id if loser_id == self.current_faceoff.player2_id 
                    else self.current_faceoff.player2_id)
        winner = self.get_player(winner_id)
        
        if not winner:
            return None
        
        # Transfer the top card from loser to winner
        transferred_card = loser.remove_top_card()
        if not transferred_card:
            return None
            
        winner.add_card_to_deck(transferred_card)
        winner.score += 1
        
        # Add to game history
        self.add_event(GameEvent(
            event_type="faceoff_resolved",
            player_id=winner_id,
            data={
                "winner": winner_id,
                "loser": loser_id,
                "transferredCard": transferred_card.to_dict(),
                "pointsAwarded": 1
            }
        ))
        
        # Clear the faceoff
        self.current_faceoff = None
        self.status = GameStatus.ACTIVE
        
        return {
            "winner": winner.to_dict(),
            "loser": loser.to_dict(),
            "transferredCard": transferred_card.to_dict(),
            "gameState": self.to_dict()
        }
    
    def is_player_turn(self, player_id: str) -> bool:
        """Check if it's the specified player's turn"""
        return self.current_player_id == player_id and self.status == GameStatus.ACTIVE
    
    def next_turn(self) -> Optional[Player]:
        """Advance to the next player's turn"""
        if not self.players:
            return None
        
        # Move to next player
        self.current_player_index = (self.current_player_index + 1) % len(self.players)
        next_player = self.players[self.current_player_index]
        self.current_player_id = next_player.id
        
        # Reset the new player's turn flag so they can flip a card
        next_player.reset_turn_flag()
        
        # Add turn change event
        self.add_event(GameEvent(
            event_type="turn_changed",
            player_id=self.current_player_id,
            data={
                "previousPlayerIndex": (self.current_player_index - 1) % len(self.players),
                "currentPlayerIndex": self.current_player_index
            }
        ))
        
        self.last_activity = datetime.now()
        return self.players[self.current_player_index]
    
    def set_initial_turn(self) -> Optional[Player]:
        """Set the first player's turn when game starts"""
        if not self.players:
            return None
        
        self.current_player_index = 0
        self.current_player_id = self.players[0].id
        self.status = GameStatus.ACTIVE
        
        # Add initial turn event
        self.add_event(GameEvent(
            event_type="game_started",
            player_id=self.current_player_id,
            data={"firstPlayer": self.current_player_id}
        ))
        
        self.last_activity = datetime.now()
        return self.players[0]
