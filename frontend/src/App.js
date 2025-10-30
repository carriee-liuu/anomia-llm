import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import components
import HomeScreen from './components/HomeScreen';
import Lobby from './components/Lobby';
import GamePlay from './components/GamePlay';

// Import context
import { GameProvider } from './context/GameContext';

// Import styles
import './App.css';

function App() {
  return (
    <Router>
      <GameProvider>
        <div className="App min-h-screen bg-background">
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <HomeScreen />
                  </motion.div>
                } 
              />
              <Route 
                path="/waiting-room/:roomCode" 
                element={
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Lobby />
                  </motion.div>
                } 
              />
              <Route 
                path="/lobby/:roomCode" 
                element={
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Lobby />
                  </motion.div>
                } 
              />
              <Route 
                path="/game/:roomCode" 
                element={
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                  >
                    <GamePlay />
                  </motion.div>
                } 
              />
            </Routes>
          </AnimatePresence>
        </div>
      </GameProvider>
    </Router>
  );
}

export default App; 