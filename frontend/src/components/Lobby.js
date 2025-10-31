import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { 
  Users, 
  Play, 
  ClipboardCopy, 
  Check, 
  Crown, 
  UserPlus,
  Settings,
  MessageCircle,
  X
} from 'lucide-react';

const Lobby = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { 
    players, 
    currentPlayer, 
    startGame, 
    messages,
    exitGame
  } = useGame();
  
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    difficulty: 'medium'
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

  // Calculate time ago
  const getTimeAgo = (joinedAt) => {
    if (!joinedAt) return 'Just now';
    const now = new Date();
    const joined = new Date(joinedAt);
    const diffMs = now - joined;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 min ago';
    return `${diffMins} mins ago`;
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto relative">
        {/* Exit Button - Top Right */}
        <button
          onClick={exitGame}
          className="absolute top-0 right-0 z-50 p-2 bg-background border-[3px] border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:bg-muted hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all"
          title="Exit Lobby"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Header */}
        <motion.header 
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <div className="bg-background border-[3px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] px-6 md:px-8 py-4 pt-4 w-full">
              <h1 className="font-heading text-4xl md:text-5xl text-primary tracking-wider text-center">
                LOBBY
              </h1>
            </div>
          </div>
          
          {/* Room Code and Settings */}
          <div className="flex items-center justify-start gap-2">
            <div className="bg-card border-[3px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] px-4 md:px-5 py-2 flex items-center gap-4 flex-1 h-[51px]">
              <span className="font-sans text-sm text-foreground">ROOM CODE:</span>
              <span className="font-sans text-xl font-bold text-foreground">
                {typeof roomCode === 'string' ? roomCode : roomCode?.roomCode || 'Loading...'}
              </span>
              <button
                onClick={copyRoomCode}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {copied ? <Check className="w-5 h-5" /> : <ClipboardCopy className="w-5 h-5" />}
              </button>
            </div>
            {/* Settings Button - Inline with Room Code (only for host) */}
            {isHost && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-[55px] h-[51px] bg-card border-[3px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:bg-muted transition-colors flex items-center justify-center"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-foreground" />
              </button>
            )}
          </div>
        </motion.header>

        <div className="space-y-6">
          {/* Players List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card border-[3px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-6">
              <h2 className="font-heading text-xl text-foreground mb-6 flex items-center gap-2">
                <Users className="w-6 h-6" />
                PLAYERS ({players.length})
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
                          <div className="flex items-center gap-2">
                            <p className="font-sans font-bold text-foreground text-base">
                              {player.name}
                            </p>
                            {player.isHost && (
                              <span className="text-primary text-sm font-heading">(HOST)</span>
                            )}
                          </div>
                          <p className="font-sans text-sm text-muted-foreground">
                            {getTimeAgo(player.joinedAt)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add Player Placeholder */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-[3px] border-dashed border-foreground bg-background p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
                >
                  <UserPlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-sans text-base text-muted-foreground">Waiting for more players...</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Game Settings */}
          {showSettings && (
            <motion.div 
              className="bg-card border-[3px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <h3 className="font-heading text-lg text-foreground mb-4">GAME SETTINGS</h3>
              <div className="space-y-4">
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
              </div>
            </motion.div>
          )}

          {/* Start Game Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-card border-[3px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-6">
              <h3 className="font-heading text-lg text-foreground mb-4">READY TO PLAY?</h3>
              
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
                className={`w-full py-4 px-6 font-heading text-lg transition-all duration-200 border-[3px] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 ${
                  canStartGame
                    ? 'bg-primary text-white border-foreground hover:bg-primary/90 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]'
                    : 'bg-muted text-muted-foreground border-foreground cursor-not-allowed'
                }`}
              >
                <Play className="w-6 h-6" />
                <span>START GAME</span>
              </button>
            </div>
          </motion.div>

          {/* Chat/Messages */}
          {messages.length > 0 && (
            <div className="bg-card border-[3px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-6">
              <h3 className="font-heading text-lg text-foreground mb-4 flex items-center gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default Lobby;
