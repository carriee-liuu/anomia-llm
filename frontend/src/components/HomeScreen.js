import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Button } from './ui/button';
import AnomiaShape from './AnomiaShape';

const HomeScreen = () => {
  const navigate = useNavigate();
  const { resetGame } = useGame();

  // Clear game state when arriving at home screen
  useEffect(() => {
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-between p-3 md:p-4 bg-background">
      {/* Top section - Logo and tagline */}
      <motion.div 
        className="w-full max-w-md pt-4 md:pt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="bg-background border-[4px] md:border-[8px] border-[oklch(0.35_0.08_280)] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] md:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.4)] px-6 md:px-12 py-6 md:py-10 flex items-center justify-center">
            <h1 className="font-heading text-5xl md:text-8xl lg:text-9xl text-primary tracking-wider md:tracking-widest">ANOMIA</h1>
          </div>
        </div>
        <p className="font-sans text-base md:text-xl text-center font-bold tracking-wide text-foreground -mb-2 md:-mb-3">
          Match symbols, race to name categories!
        </p>
      </motion.div>

      {/* Middle section - Card illustration */}
      <motion.div 
        className="flex-1 flex items-center justify-center w-full pt-0 pb-0 md:pt-0 md:pb-0 min-h-0 -mt-2 md:-mt-3"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="relative w-72 h-72 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem]">
          {/* Card 1 - Orange/Gold with Circle */}
          <div className="absolute top-0 left-4 md:left-8 lg:left-12 w-44 h-60 md:w-64 md:h-[22rem] lg:w-80 lg:h-[22rem] bg-accent border-[4px] md:border-[6px] border-[oklch(0.35_0.08_280)] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] transform -rotate-12 flex items-center justify-center">
            <AnomiaShape shape="circle" size={85} color="oklch(0.95 0.02 60)" />
          </div>
          {/* Card 2 - Purple with Waves */}
          <div className="absolute top-4 md:top-6 lg:top-8 right-4 md:right-8 lg:right-12 w-44 h-60 md:w-64 md:h-[22rem] lg:w-80 lg:h-[22rem] bg-primary border-[4px] md:border-[6px] border-[oklch(0.35_0.08_280)] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] transform rotate-12 flex items-center justify-center">
            <AnomiaShape shape="waves" size={85} color="oklch(0.95 0.02 60)" />
          </div>
          {/* Decorative sparkles */}
          <div className="absolute -top-4 md:-top-6 lg:-top-8 left-0 text-3xl md:text-5xl lg:text-6xl opacity-70">✦</div>
          <div className="absolute top-8 md:top-12 lg:top-16 -right-4 md:-right-6 lg:-right-8 text-2xl md:text-4xl lg:text-5xl opacity-70">✧</div>
          <div className="absolute -bottom-2 md:-bottom-4 lg:-bottom-6 left-12 md:left-16 lg:left-20 text-xl md:text-3xl lg:text-4xl opacity-70">✦</div>
          <div className="absolute bottom-4 md:bottom-6 lg:bottom-8 right-0 text-2xl md:text-4xl lg:text-5xl opacity-70">○</div>
        </div>
      </motion.div>

      {/* Bottom section - Navigation Buttons */}
      <motion.div 
        className="w-full max-w-md pt-0 pb-4 md:pt-0 md:pb-6 space-y-3 md:space-y-4 -mt-4 md:-mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {/* Join Game Button */}
        <Button
          onClick={() => navigate('/join')}
          variant="outline"
          className="w-full h-14 md:h-20 font-heading text-lg md:text-2xl text-[oklch(0.2_0.05_280)] !bg-[oklch(0.88_0.02_60)]/70 hover:!bg-[oklch(0.88_0.02_60)] border-[4px] md:border-[6px] border-[oklch(0.35_0.08_280)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] md:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.4)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
        >
          JOIN GAME
        </Button>

        {/* Create Game Button */}
        <Button
          onClick={() => navigate('/create')}
          variant="outline"
          className="w-full h-14 md:h-20 font-heading text-lg md:text-2xl text-[oklch(0.2_0.05_280)] !bg-[oklch(0.88_0.02_60)] hover:!bg-[oklch(0.88_0.02_60)]/80 border-[4px] md:border-[6px] border-[oklch(0.35_0.08_280)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] md:hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.4)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
        >
          CREATE GAME
        </Button>

        <button className="w-full font-sans text-sm md:text-lg underline opacity-70 hover:opacity-100 transition-opacity py-1 md:py-2 text-foreground">
          How to play
        </button>
      </motion.div>
    </div>
  );
};

export default HomeScreen;
