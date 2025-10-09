# 🎮 Anomia LLM - AI-Powered Party Word Game

A real-time multiplayer implementation of the popular party game **Anomia** with AI-powered card generation and modern web technologies. Players compete in fast-paced word association challenges with swipe gestures and visual feedback.

![Anomia Gameplay](https://img.shields.io/badge/Game-Anomia-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.0-green)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-orange)

## 🎯 Features

- **Real-time Multiplayer**: WebSocket-based communication for instant game updates
- **AI-Powered Cards**: OpenAI GPT integration for dynamic card generation
- **Modern UI/UX**: React with Tailwind CSS and Framer Motion animations
- **Swipe Gestures**: Touch-friendly interface for mobile and tablet gameplay
- **Type-Safe Backend**: Python with Pydantic models and FastAPI
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile
- **Room Management**: Create and join game rooms with unique codes
- **Turn-Based Gameplay**: Structured game flow with faceoff detection

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - Modern UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **WebSocket API** - Real-time communication

### Backend
- **FastAPI** - Modern Python web framework
- **WebSockets** - Real-time bidirectional communication
- **Pydantic** - Data validation and serialization
- **OpenAI API** - AI-powered card generation
- **Uvicorn** - ASGI server

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **GitHub Actions** - CI/CD pipeline
- **Docker** - Containerization

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/anomia-llm.git
   cd anomia-llm
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   source venv/bin/activate
   python start.py

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 How to Play

1. **Create a Room**: Host creates a game room and shares the room code
2. **Join Players**: Other players join using the room code
3. **Start Game**: Host starts the game when ready
4. **Flip Cards**: Players take turns flipping cards
5. **Faceoffs**: When matching shapes appear, players compete to name items in the category
6. **Swipe to Surrender**: Loser swipes their card to give it to the winner
7. **Win**: First player to collect 5 cards wins!

## 📁 Project Structure

```
anomia-llm/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React Context for state management
│   │   └── App.js          # Main application component
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # FastAPI backend application
│   ├── models/             # Pydantic data models
│   ├── services/           # Business logic services
│   ├── main.py            # FastAPI application
│   ├── start.py           # Development server
│   └── requirements.txt
├── .github/                # GitHub Actions workflows
├── docker-compose.yml     # Docker configuration
└── README.md
```

## 🔧 API Documentation

### REST Endpoints

- `POST /api/rooms` - Create a new game room
- `GET /api/rooms/{room_code}` - Get room information
- `POST /api/rooms/{room_code}/start` - Start a game

### WebSocket Events

- `joinRoom` - Join a game room
- `flipCard` - Flip a card during gameplay
- `resolveFaceoff` - Resolve a faceoff between players
- `gameStarted` - Game has started
- `faceoffDetected` - Faceoff detected between players

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run individual services
docker build -t anomia-frontend ./frontend
docker build -t anomia-backend ./backend
```

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
source venv/bin/activate
python -m pytest
```

## 📈 Performance Features

- **Optimized WebSocket connections** with automatic reconnection
- **Efficient state management** using React Context and useReducer
- **Lazy loading** for better initial page load
- **Responsive images** and optimized assets
- **Connection pooling** for database operations

## 🔒 Security Features

- **Input validation** with Pydantic models
- **CORS configuration** for cross-origin requests
- **Environment variable** protection for API keys
- **Rate limiting** on API endpoints
- **WebSocket authentication** for room access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the original Anomia card game
- Built with modern web technologies
- Special thanks to the open-source community

## 📞 Contact

**Your Name** - [@yourusername](https://github.com/yourusername) - your.email@example.com

Project Link: [https://github.com/yourusername/anomia-llm](https://github.com/yourusername/anomia-llm)

---

⭐ **Star this repository if you found it helpful!**# Trigger GitHub Actions
# Trigger deployment
# Deployment Status: Ready for GitHub Pages
# Force Fresh Deployment - Wed Oct  8 22:42:26 PDT 2025
# Force Fresh Deployment - Wed Oct  8 22:44:03 PDT 2025
