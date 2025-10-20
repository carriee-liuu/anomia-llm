import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { 
  Users, 
  Play, 
  Copy, 
  Check, 
  Crown, 
  UserPlus,
  Settings,
  MessageCircle
} from 'lucide-react';

const Lobby = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { 
    players, 
    currentPlayer, 
    startGame, 
    messages 
  } = useGame();
  
  // Debug logging
  console.log('Lobby roomCode from useParams:', roomCode);
  console.log('Type of roomCode:', typeof roomCode);
  
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    rounds: 5,
    difficulty: 'medium',
    timeLimit: 30
  });

  // Copy room code to clipboard
  const copyRoomCode = async () => {
    try {
      const codeToCopy = typeof roomCode === 'string' ? roomCode : JSON.stringify(roomCode);
      await navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Start the game
  const handleStartGame = () => {
    if (players.length >= 2) {
      startGame();
      navigate(`/game/${roomCode}`);
    }
  };

  // Check if current player is host
  const isHost = currentPlayer?.isHost;

  // Check if game can start
  const canStartGame = players.length >= 2 && isHost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Game Lobby
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-lg px-4 py-2">
              <span className="text-gray-300 text-sm">Room Code:</span>
              <span className="text-white font-mono text-xl ml-2">
                {typeof roomCode === 'string' ? roomCode : roomCode?.roomCode || 'Loading...'}
              </span>
              <button
                onClick={copyRoomCode}
                className="ml-3 text-blue-400 hover:text-blue-300 transition-colors"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {isHost && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="bg-white/20 backdrop-blur-lg rounded-lg px-4 py-2 text-white hover:bg-white/30 transition-colors"
              >
                <Settings className="w-5 h-5 inline mr-2" />
                Settings
              </button>
            )}
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Players List */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Players ({players.length}/8)
              </h2>
              
              <div className="space-y-4">
                <AnimatePresence>
                  {players.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        player.isHost 
                          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                          : 'bg-white/10 border border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          player.isHost 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                            : 'bg-gradient-to-r from-blue-400 to-purple-500'
                        }`}>
                          {player.isHost ? (
                            <Crown className="w-5 h-5 text-white" />
                          ) : (
                            <span className="text-white font-bold text-lg">
                              {player.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {player.name}
                            {player.isHost && (
                              <span className="ml-2 text-yellow-400 text-sm">(Host)</span>
                            )}
                          </p>
                          <p className="text-gray-300 text-sm">
                            Joined {new Date(player.joinedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      {player.isHost && (
                        <div className="text-yellow-400">
                          <Crown className="w-6 h-6" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add Player Placeholder */}
                {players.length < 8 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center"
                  >
                    <UserPlus className="w-8 h-8 text-white/50 mx-auto mb-2" />
                    <p className="text-white/50">Waiting for more players...</p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Game Controls & Info */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Game Settings */}
            {showSettings && (
              <motion.div 
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Game Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Number of Rounds</label>
                    <select
                      value={gameSettings.rounds}
                      onChange={(e) => setGameSettings({...gameSettings, rounds: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                    >
                      <option value={3}>3 Rounds</option>
                      <option value={5}>5 Rounds</option>
                      <option value={7}>7 Rounds</option>
                      <option value={10}>10 Rounds</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Difficulty</label>
                    <select
                      value={gameSettings.difficulty}
                      onChange={(e) => setGameSettings({...gameSettings, difficulty: e.target.value})}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Time Limit (seconds)</label>
                    <select
                      value={gameSettings.timeLimit}
                      onChange={(e) => setGameSettings({...gameSettings, timeLimit: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white"
                    >
                      <option value={20}>20 seconds</option>
                      <option value={30}>30 seconds</option>
                      <option value={45}>45 seconds</option>
                      <option value={60}>60 seconds</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Start Game Button */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Ready to Play?</h3>
              
              {!canStartGame && (
                <div className="text-center mb-4">
                  <p className="text-gray-300 text-sm">
                    {players.length < 2 
                      ? `Need ${2 - players.length} more player${2 - players.length === 1 ? '' : 's'} to start`
                      : 'Only the host can start the game'
                    }
                  </p>
                </div>
              )}
              
              <button
                onClick={handleStartGame}
                disabled={!canStartGame}
                className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 ${
                  canStartGame
                    ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white hover:from-green-600 hover:to-teal-700 transform hover:scale-105'
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
              >
                <Play className="w-6 h-6 inline mr-2" />
                Start Game
              </button>
            </div>

            {/* Game Rules */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">How to Play</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                <li>Each player gets cards with categories</li>
                <li>When cards match, race to name an example!</li>
                <li>First correct answer gets a point</li>
                <li>Play {gameSettings.rounds} rounds to win</li>
              </ol>
            </div>

            {/* Chat/Messages */}
            {messages.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Recent Activity
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {messages.slice(-5).map((message, index) => (
                    <div key={index} className="text-sm">
                      <span className="text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}:
                      </span>
                      <span className={`ml-2 ${
                        message.type === 'success' ? 'text-green-400' :
                        message.type === 'error' ? 'text-red-400' :
                        message.type === 'warning' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`}>
                        {message.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Lobby; 