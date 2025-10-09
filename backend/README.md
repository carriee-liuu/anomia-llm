# 🐍 Anomia LLM Python Backend

A modern, fast Python backend for the Anomia LLM multiplayer word game, built with FastAPI and WebSockets.

## ✨ Features

- **FastAPI Framework**: Modern, fast web framework with automatic API documentation
- **WebSocket Support**: Real-time communication for multiplayer gameplay
- **LLM Integration**: OpenAI API integration for dynamic category generation
- **Service Architecture**: Clean separation of concerns with dedicated services
- **Async/Await**: High-performance asynchronous programming
- **Type Hints**: Full Python type annotations for better code quality
- **Auto-documentation**: Automatic OpenAPI/Swagger documentation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Python        │    │   OpenAI        │
│   (React)       │◄──►│   Backend       │◄──►│   API           │
│                 │    │   (FastAPI)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Services      │
                       │                 │
                       │ • RoomService   │
                       │ • GameService   │
                       │ • LLMService    │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd anomia-llm/backend-python
   ```

2. **Create a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your OpenAI API key and other settings
   ```

5. **Start the server:**
   ```bash
   python start.py
   ```

The server will start on `http://localhost:3001`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `HOST` | Server host | `0.0.0.0` |
| `DEBUG` | Debug mode | `true` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `OPENAI_API_KEY` | OpenAI API key | Required for LLM features |
| `OPENAI_MODEL` | OpenAI model to use | `gpt-3.5-turbo` |

### OpenAI Setup

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add it to your `.env` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

## 📁 Project Structure

```
backend-python/
├── main.py                 # FastAPI application entry point
├── start.py                # Startup script
├── requirements.txt        # Python dependencies
├── env.example            # Environment variables template
├── README.md              # This file
└── services/              # Service layer
    ├── __init__.py
    ├── room_service.py    # Room management
    ├── game_service.py    # Game logic
    └── llm_service.py     # AI/LLM integration
```

## 🎮 API Endpoints

### HTTP Endpoints

- `GET /health` - Health check
- `POST /api/rooms` - Create a new room
- `GET /api/rooms/{room_code}` - Get room information

### WebSocket Endpoints

- `WS /ws/{room_code}` - Real-time game communication

### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `joinRoom` | Client → Server | Player joins a room |
| `startGame` | Client → Server | Host starts the game |
| `flipCard` | Client → Server | Player flips a card |
| `submitAnswer` | Client → Server | Player submits an answer |
| `roomJoined` | Server → Client | Confirmation of room join |
| `playerJoined` | Server → Client | New player joined notification |
| `gameStarted` | Server → Client | Game has started |
| `cardFlipped` | Server → Client | Card flip result |
| `answerSubmitted` | Server → Client | Answer submission result |

## 🔌 Services

### RoomService

Manages game rooms, player joining/leaving, and room lifecycle.

**Key Methods:**
- `create_room(host_name)` - Create a new game room
- `join_room(room_code, socket_id, player_name)` - Join an existing room
- `get_room(room_code)` - Get room information
- `cleanup_expired_rooms()` - Remove expired rooms

### GameService

Handles core game logic, scoring, and game state management.

**Key Methods:**
- `start_game(room_code)` - Start a new game
- `flip_card(room_code, player_id)` - Handle card flipping
- `submit_answer(room_code, player_id, answer, category)` - Validate answers
- `end_game(room_code)` - End and clean up a game

### LLMService

Integrates with AI services for dynamic content generation.

**Key Methods:**
- `generate_categories_for_game(count, difficulty)` - Generate game categories
- `validate_answer(answer, category)` - Validate player answers
- `generate_word_examples(category, count)` - Generate example words

## 🧪 Testing

### Manual Testing

1. **Start the backend:**
   ```bash
   python start.py
   ```

2. **Test health endpoint:**
   ```bash
   curl http://localhost:3001/health
   ```

3. **Test room creation:**
   ```bash
   curl -X POST http://localhost:3001/api/rooms \
     -H "Content-Type: application/json" \
     -d '{"hostName": "TestPlayer"}'
   ```

### WebSocket Testing

Use a WebSocket client (like [websocat](https://github.com/vi/websocat)) to test real-time communication:

```bash
# Connect to a room
websocat ws://localhost:3001/ws/TEST12

# Send a join message
{"type": "joinRoom", "playerName": "TestPlayer"}
```

## 🚀 Production Deployment

### Using Gunicorn

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:3001
```

### Using Docker

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 3001

CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:3001"]
```

## 🔍 Monitoring & Debugging

### Logs

The backend uses Python's built-in logging. Set log level via environment:

```bash
export LOG_LEVEL=DEBUG
```

### Health Check

Monitor backend health:

```bash
curl http://localhost:3001/health
```

### Service Status

Check LLM service status (if OpenAI is configured):

```python
from services.llm_service import LLMService
llm = LLMService()
print(llm.get_service_status())
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

2. **Import errors:**
   ```bash
   pip install -r requirements.txt
   ```

3. **WebSocket connection failed:**
   - Check if frontend URL is correct in CORS settings
   - Verify WebSocket endpoint is accessible

4. **OpenAI API errors:**
   - Verify API key is set in `.env`
   - Check API key permissions and quota

### Debug Mode

Enable debug mode for detailed logging:

```bash
export DEBUG=true
python start.py
```

## 📚 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [WebSockets in FastAPI](https://fastapi.tiangolo.com/advanced/websockets/)
- [Python Async/Await](https://docs.python.org/3/library/asyncio.html)
- [OpenAI API Documentation](https://platform.openai.com/docs/)

## 🤝 Contributing

1. Follow Python PEP 8 style guidelines
2. Add type hints to all functions
3. Include docstrings for all methods
4. Test your changes thoroughly

## 📄 License

This project is part of the Anomia LLM game application. 