import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import AnomiaShape from './AnomiaShape';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { createRoom, joinRoom, loading, error, clearError, resetGame } = useGame();
  
  const [hostName, setHostName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Clear game state when arriving at home screen
  useEffect(() => {
    resetGame();
  }, []); // Only run on mount

  const handleCreateRoom = async () => {
    if (!hostName.trim()) return;
    
    try {
      setIsCreating(true);
      const data = await createRoom(hostName);
      console.log('HomeScreen createRoom response:', data);
      console.log('Room code extracted:', data?.room?.roomCode);
      if (data && data.room && data.room.roomCode) {
        console.log('Navigating to:', `/waiting-room/${data.room.roomCode}`);
        navigate(`/waiting-room/${data.room.roomCode}`);
      }
    } catch (err) {
      console.error('Failed to create room:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !playerName.trim()) return;
    
    try {
      const success = await joinRoom(roomCode, playerName);
      if (success) {
        navigate(`/waiting-room/${roomCode}`);
      }
    } catch (err) {
      console.error('Failed to join room:', err);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto flex flex-col items-center justify-between p-4 md:p-6 bg-background">
      {/* Top section - Logo and tagline */}
      <motion.div 
        className="w-full max-w-md pt-4 md:pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center mb-4 md:mb-6 px-2 md:px-4">
          <div className="bg-background border-[4px] md:border-[8px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.4)] px-8 md:px-16 py-4 md:py-8 w-full">
            <h1 className="font-heading text-4.5xl md:text-7xl text-primary tracking-wider md:tracking-widest text-center">ANOMIA</h1>
          </div>
        </div>
        <p className="font-sans text-base md:text-xl text-center font-bold tracking-wide text-foreground mb-6 md:mb-10">
          Match symbols, race to name categories!
        </p>
      </motion.div>

      {/* Middle section - Card illustration */}
      <motion.div 
        className="flex-1 flex items-center justify-center py-2 md:py-4 max-h-[40vh]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="relative w-48 h-48 md:w-80 md:h-80">
          {/* Card 1 - Orange/Gold with no shape */}
          <div className="absolute top-0 left-4 md:left-8 w-32 h-44 md:w-48 md:h-64 bg-accent border-[4px] md:border-[6px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] transform -rotate-12 flex items-center justify-center">
          </div>
          {/* Card 2 - Purple with Waves */}
          <div className="absolute top-2 md:top-4 right-4 md:right-8 w-32 h-44 md:w-48 md:h-64 bg-primary border-[4px] md:border-[6px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] transform rotate-12 flex items-center justify-center">
            <AnomiaShape shape="waves" size={80} color="#06B6D4" />
          </div>
          {/* Decorative sparkles */}
          <div className="absolute -top-2 md:-top-4 left-0 text-2xl md:text-4xl opacity-70">✦</div>
          <div className="absolute top-4 md:top-8 -right-2 md:-right-4 text-xl md:text-3xl opacity-70">✧</div>
          <div className="absolute -bottom-1 md:-bottom-2 left-8 md:left-12 text-lg md:text-2xl opacity-70">✦</div>
          <div className="absolute bottom-2 md:bottom-4 right-0 text-xl md:text-3xl opacity-70">○</div>
        </div>
      </motion.div>

      {/* Bottom section - Buttons and How to Play */}
      <motion.div 
        className="w-full max-w-md pb-4 md:pb-8 pt-6 md:pt-10 space-y-3 md:space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {/* Create Room Form */}
        <div className="bg-card border-[4px] md:border-[6px] border-foreground p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] space-y-4 md:space-y-6">
          <div>
            <label className="font-sans text-sm mb-2 block font-bold text-foreground">YOUR NAME</label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              className="h-12 md:h-14 font-sans text-base md:text-lg border-[4px] border-foreground bg-background focus:ring-0 focus:border-primary text-foreground"
            />
          </div>

          <Button
            onClick={handleCreateRoom}
            disabled={!hostName.trim() || loading || isCreating}
            className="w-full h-14 md:h-16 font-heading text-lg md:text-xl bg-background hover:bg-muted text-foreground border-[4px] md:border-[6px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating Room...' : 'CREATE ROOM'}
          </Button>
        </div>

        {/* Join Room Form */}
        <div className="bg-card border-[4px] md:border-[6px] border-foreground p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] space-y-4 md:space-y-6">
          <div>
            <label className="font-sans text-sm mb-2 block font-bold text-foreground">ROOM CODE</label>
            <Input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="h-12 md:h-14 font-sans text-base md:text-lg border-[4px] border-foreground bg-background focus:ring-0 focus:border-accent uppercase tracking-wider text-foreground"
            />
          </div>

          <div>
            <label className="font-sans text-sm mb-2 block font-bold text-foreground">YOUR NAME</label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="h-12 md:h-14 font-sans text-base md:text-lg border-[4px] border-foreground bg-background focus:ring-0 focus:border-primary text-foreground"
            />
          </div>

          <Button
            onClick={handleJoinRoom}
            disabled={!roomCode.trim() || !playerName.trim() || loading}
            className="w-full h-14 md:h-16 font-heading text-lg md:text-xl bg-background hover:bg-muted text-foreground border-[4px] md:border-[6px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            JOIN ROOM
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div 
            className="bg-destructive/20 border border-destructive/30 rounded-lg p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-destructive-foreground">{error}</p>
            <button 
              onClick={clearError}
              className="text-destructive-foreground/70 hover:text-destructive-foreground text-sm mt-2"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        <button className="w-full font-sans text-sm md:text-lg underline opacity-70 hover:opacity-100 transition-opacity py-1 md:py-2 text-foreground">
          How to play
        </button>
      </motion.div>
    </div>
  );
};

export default HomeScreen;