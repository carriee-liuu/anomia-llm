# API Documentation

## Overview
The Anomia LLM API provides real-time multiplayer game functionality with AI-powered card generation. The API consists of REST endpoints for room management and WebSocket connections for real-time gameplay.

## Base URL
- **Development**: `http://localhost:3001`
- **Production**: `https://your-domain.com`

## Authentication
Currently, the API uses room-based authentication. Players join rooms using room codes.

## REST Endpoints

### Room Management

#### Create Room
```http
POST /api/rooms
Content-Type: application/json

{
  "hostName": "string"
}
```

**Response:**
```json
{
  "success": true,
  "room": {
    "roomCode": "string",
    "hostName": "string",
    "hostId": "string",
    "players": [],
    "status": "waiting",
    "createdAt": "string",
    "settings": {
      "maxPlayers": 8,
      "difficulty": "medium",
      "rounds": 5,
      "timeLimit": 30
    }
  }
}
```

#### Get Room
```http
GET /api/rooms/{roomCode}
```

**Response:**
```json
{
  "success": true,
  "room": {
    "roomCode": "string",
    "hostName": "string",
    "players": [
      {
        "id": "string",
        "name": "string",
        "isHost": boolean,
        "joinedAt": "string",
        "socketId": "string"
      }
    ],
    "status": "waiting|playing|finished",
    "createdAt": "string"
  }
}
```

#### Start Game
```http
POST /api/rooms/{roomCode}/start
```

**Response:**
```json
{
  "success": true,
  "message": "Game started successfully",
  "gameState": {
    "status": "playing",
    "currentPlayer": "string",
    "players": [...],
    "deck": [...],
    "faceoff": null
  }
}
```

## WebSocket Events

### Connection
Connect to WebSocket at: `ws://localhost:3001/ws/{roomCode}`

### Client to Server Events

#### Join Room
```json
{
  "type": "joinRoom",
  "playerName": "string",
  "roomCode": "string"
}
```

#### Flip Card
```json
{
  "type": "flipCard",
  "roomCode": "string"
}
```

#### Resolve Faceoff
```json
{
  "type": "resolveFaceoff",
  "loserId": "string"
}
```

### Server to Client Events

#### Room Joined
```json
{
  "type": "roomJoined",
  "data": {
    "room": {...},
    "player": {...},
    "message": "string"
  }
}
```

#### Player Joined
```json
{
  "type": "playerJoined",
  "data": {
    "room": {...},
    "player": {...}
  }
}
```

#### Game Started
```json
{
  "type": "gameStarted",
  "data": {
    "gameState": {...}
  }
}
```

#### Card Flipped
```json
{
  "type": "cardFlipped",
  "data": {
    "player": {...},
    "card": {...},
    "gameState": {...}
  }
}
```

#### Faceoff Detected
```json
{
  "type": "faceoffDetected",
  "data": {
    "faceoff": {
      "players": [...],
      "card": {...},
      "category": "string"
    },
    "gameState": {...}
  }
}
```

#### Faceoff Resolved
```json
{
  "type": "faceoffResolved",
  "data": {
    "winner": {...},
    "loser": {...},
    "gameState": {...}
  }
}
```

#### Game Over
```json
{
  "type": "gameOver",
  "data": {
    "winner": {...},
    "finalScores": {...}
  }
}
```

## Error Responses

### HTTP Errors
```json
{
  "success": false,
  "error": "string",
  "message": "string",
  "code": "string"
}
```

### WebSocket Errors
```json
{
  "type": "error",
  "data": {
    "error": "string",
    "message": "string",
    "code": "string"
  }
}
```

## Status Codes

- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting
- Room creation: 10 requests per minute per IP
- WebSocket connections: 5 per room
- Card flipping: 1 per second per player

## Data Models

### Player
```json
{
  "id": "string",
  "name": "string",
  "isHost": boolean,
  "joinedAt": "string",
  "socketId": "string",
  "score": number,
  "cards": []
}
```

### Card
```json
{
  "id": "string",
  "shape": "circle|square|triangle|diamond",
  "category": "string",
  "items": ["string"]
}
```

### Faceoff
```json
{
  "players": [Player],
  "card": Card,
  "category": "string",
  "startTime": "string"
}
```
