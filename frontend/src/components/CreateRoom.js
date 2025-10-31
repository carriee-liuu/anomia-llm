import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

const CreateRoom = () => {
  const navigate = useNavigate();
  const { createRoom, loading, error, clearError } = useGame();
  
  const [playerName, setPlayerName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!playerName.trim()) return;
    
    try {
      setIsCreating(true);
      const data = await createRoom(playerName);
      if (data && data.room && data.room.roomCode) {
        navigate(`/waiting-room/${data.room.roomCode}`);
      }
    } catch (err) {
      console.error('Failed to create room:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex justify-center">
          <div className="bg-background border-[4px] md:border-[6px] border-[oklch(0.35_0.08_280)] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] px-6 md:px-8 py-3 md:py-4">
            <h1 className="font-heading text-xl md:text-3xl text-primary tracking-wider">NEW GAME ROOM</h1>
          </div>
        </div>

        {/* Form */}
        <div className="bg-muted border-[4px] md:border-[6px] border-[oklch(0.35_0.08_280)] p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] space-y-4 md:space-y-6">
          <div>
            <label className="font-sans text-sm mb-2 block font-bold">YOUR NAME</label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="h-12 md:h-14 font-sans text-base md:text-lg border-[4px] border-[oklch(0.35_0.08_280)] bg-background focus:ring-0 focus:border-primary"
            />
          </div>

          <Button
            onClick={handleCreate}
            disabled={!playerName.trim() || loading || isCreating}
            className="w-full h-14 md:h-16 font-heading text-lg md:text-xl bg-primary hover:bg-primary/90 text-background border-[4px] md:border-[6px] border-[oklch(0.35_0.08_280)] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating Room...' : 'CREATE ROOM'}
          </Button>

          <Button
            onClick={() => navigate('/')}
            className="w-full h-12 md:h-14 font-heading text-base md:text-lg text-[oklch(0.2_0.05_280)] bg-muted hover:bg-muted/90 border-[4px] md:border-[6px] border-[oklch(0.35_0.08_280)] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            BACK
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-4">
            <p className="text-destructive-foreground">{error}</p>
            <button 
              onClick={clearError}
              className="text-destructive-foreground/70 hover:text-destructive-foreground text-sm mt-2"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateRoom;
