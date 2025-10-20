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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <div className="bg-background border-[4px] md:border-[6px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] px-6 md:px-12 py-3 md:py-6 w-full max-w-lg">
              <h1 className="font-heading text-4.5xl md:text-6xl text-primary tracking-wider md:tracking-widest text-center">
                LOBBY
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="bg-card border-[4px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] px-4 py-2">
              <span className="font-sans text-sm text-foreground">ROOM CODE:</span>
              <span className="font-sans text-xl ml-2 text-foreground font-bold">
                {typeof roomCode === 'string' ? roomCode : roomCode?.roomCode || 'Loading...'}
              </span>
              <button
                onClick={copyRoomCode}
                className="ml-3 text-primary hover:text-primary/80 transition-colors"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {isHost && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="bg-card border-[4px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] px-4 py-2 text-foreground hover:bg-muted transition-colors font-sans font-bold"
              >
                <Settings className="w-5 h-5 inline mr-2" />
                SETTINGS
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
            <div className="bg-card border-[4px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-6">
              <h2 className="font-heading text-xl md:text-2xl text-foreground mb-6 flex items-center gap-2">
                <Users className="w-6 h-6" />
                PLAYERS ({players.length}/8)
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
                      className={`flex items-center justify-between p-4 border-[3px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] ${
                        player.isHost 
                          ? 'bg-accent border-foreground' 
                          : 'bg-background border-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 border-[3px] border-foreground flex items-center justify-center ${
                          player.isHost 
                            ? 'bg-primary' 
                            : 'bg-accent'
                        }`}>
                          {player.isHost ? (
                            <Crown className="w-5 h-5 text-white" />
                          ) : (
                            <span className="text-white font-heading text-lg">
                              {player.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-sans font-bold text-foreground">
                            {player.name}
                            {player.isHost && (
                              <span className="ml-2 text-primary text-sm font-heading">(HOST)</span>
                            )}
                          </p>
                          <p className="font-sans text-sm text-muted-foreground">
                            Joined {new Date(player.joinedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      {player.isHost && (
                        <div className="text-primary">
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
                    className="border-[3px] border-dashed border-foreground bg-background p-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
                  >
                    <UserPlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="font-sans text-muted-foreground">Waiting for more players...</p>
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
                className="bg-card border-[4px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3 className="font-heading text-lg md:text-xl text-foreground mb-4">GAME SETTINGS</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block font-sans text-sm mb-2 text-foreground font-bold">NUMBER OF ROUNDS</label>
                    <select
                      value={gameSettings.rounds}
                      onChange={(e) => setGameSettings({...gameSettings, rounds: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-background border-[3px] border-foreground text-foreground font-sans"
                    >
                      <option value={3}>3 Rounds</option>
                      <option value={5}>5 Rounds</option>
                      <option value={7}>7 Rounds</option>
                      <option value={10}>10 Rounds</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-sans text-sm mb-2 text-foreground font-bold">DIFFICULTY</label>
                    <select
                      value={gameSettings.difficulty}
                      onChange={(e) => setGameSettings({...gameSettings, difficulty: e.target.value})}
                      className="w-full px-3 py-2 bg-background border-[3px] border-foreground text-foreground font-sans"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-sans text-sm mb-2 text-foreground font-bold">TIME LIMIT (SECONDS)</label>
                    <select
                      value={gameSettings.timeLimit}
                      onChange={(e) => setGameSettings({...gameSettings, timeLimit: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-background border-[3px] border-foreground text-foreground font-sans"
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
            <div className="bg-card border-[4px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-6">
              <h3 className="font-heading text-lg md:text-xl text-foreground mb-4">READY TO PLAY?</h3>
              
              {!canStartGame && (
                <div className="text-center mb-4">
                  <p className="font-sans text-sm text-muted-foreground">
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
                className={`w-full py-4 px-6 font-heading text-lg transition-all duration-200 border-[4px] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] ${
                  canStartGame
                    ? 'bg-primary text-white border-foreground hover:bg-primary/90 hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    : 'bg-muted text-muted-foreground border-foreground cursor-not-allowed'
                }`}
              >
                <Play className="w-6 h-6 inline mr-2" />
                START GAME
              </button>
            </div>

            {/* Chat/Messages */}
            {messages.length > 0 && (
              <div className="bg-card border-[4px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-6">
                <h3 className="font-heading text-lg md:text-xl text-foreground mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  RECENT ACTIVITY
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {messages.slice(-5).map((message, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-sans text-muted-foreground">
                        {new Date(message.timestamp).toLocaleTimeString()}:
                      </span>
                      <span className={`ml-2 font-sans ${
                        message.type === 'success' ? 'text-primary' :
                        message.type === 'error' ? 'text-destructive' :
                        message.type === 'warning' ? 'text-accent' :
                        'text-foreground'
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