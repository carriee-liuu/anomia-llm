import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Gamepad2, Users, Sparkles, Trophy } from 'lucide-react';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { createRoom, joinRoom, loading, error, clearError } = useGame();
  
  const [hostName, setHostName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (!hostName.trim()) return;
    
    try {
      setIsCreating(true);
      const result = await createRoom(hostName.trim());
      if (result.success) {
        navigate(`/lobby/${result.room.roomCode}`);
      }
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = () => {
    if (!roomCode.trim() || !playerName.trim()) return;
    
    joinRoom(roomCode.trim().toUpperCase(), playerName.trim());
    navigate(`/lobby/${roomCode.trim().toUpperCase()}`);
  };

  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
      title: "AI-Powered Categories",
      description: "Never run out of fresh, creative categories with our LLM integration"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-400" />,
      title: "Multiplayer Fun",
      description: "Play with friends in real-time across any device"
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-green-400" />,
      title: "Fast-Paced Action",
      description: "Quick thinking and fast answers in this exciting party game"
    },
    {
      icon: <Trophy className="w-8 h-8 text-purple-400" />,
      title: "Competitive Scoring",
      description: "Track points and compete for the highest score"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header 
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl font-bold text-white mb-4">
          Anomia <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">LLM</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          The AI-powered party word game that never runs out of categories. 
          Race against friends to name examples from dynamic categories!
        </p>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-8 px-4 max-w-7xl mx-auto">
        {/* Left Side - Game Actions */}
        <motion.div 
          className="flex-1 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Create Room */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Gamepad2 className="w-6 h-6" />
              Create New Game
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleCreateRoom}
                disabled={!hostName.trim() || loading || isCreating}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isCreating ? 'Creating Room...' : 'Create Room'}
              </button>
            </div>
          </div>

          {/* Join Room */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Join Existing Game
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 uppercase"
                maxLength={6}
              />
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleJoinRoom}
                disabled={!roomCode.trim() || !playerName.trim() || loading}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                Join Room
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div 
              className="bg-red-500/20 border border-red-500/30 rounded-lg p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-red-300">{error}</p>
              <button 
                onClick={clearError}
                className="text-red-400 hover:text-red-300 text-sm mt-2"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Right Side - Features */}
        <motion.div 
          className="flex-1 space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Why Choose Anomia LLM?
            </h2>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* How to Play */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">How to Play</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Create or join a room with friends</li>
              <li>Each player gets cards with categories</li>
              <li>When cards match, race to name an example!</li>
              <li>First to answer correctly gets a point</li>
              <li>Play multiple rounds to determine the winner</li>
            </ol>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer 
        className="text-center py-6 text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p>Built with React, Node.js, and AI magic ✨</p>
      </motion.footer>
    </div>
  );
};

export default HomeScreen; 