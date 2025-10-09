import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { 
  Play, 
  Users, 
  Trophy, 
  Clock, 
  CheckCircle,
  RotateCcw
} from 'lucide-react';
import './GamePlay.css';

const GamePlay = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { 
    gameState, 
    players, 
    currentPlayer, 
    flipCard, 
    submitAnswer,
    gameStatus,
    faceoff,
    resolveFaceoff
  } = useGame();
  
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);
  const [faceOffTimer, setFaceOffTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showAnswerInput, setShowAnswerInput] = useState(false);
  
  // Swipe gesture state
  const [swipeStart, setSwipeStart] = useState(null);
  const [swipeEnd, setSwipeEnd] = useState(null);
  
  const answerInputRef = useRef(null);
  const timerRef = useRef(null);

  // Check if it's the current player's turn
  const isMyTurn = () => {
    if (!gameState || !currentPlayer) return false;
    
    console.log('🔍 isMyTurn check:');
    console.log('🔍 gameState.currentPlayerId:', gameState.currentPlayerId);
    console.log('🔍 currentPlayer.id:', currentPlayer.id);
    console.log('🔍 gameState.status:', gameState.status);
    console.log('🔍 Are they equal?', gameState.currentPlayerId === currentPlayer.id);
    console.log('🔍 Is status active?', gameState.status === 'active');
    
    const result = gameState.currentPlayerId === currentPlayer.id && gameState.status === 'active';
    console.log('🔍 Final isMyTurn result:', result);
    
    return result;
  };

  // Check if player has already flipped this turn
  const hasFlippedThisTurn = () => {
    if (!gameState || !currentPlayer) return false;
    
    console.log('🔍 hasFlippedThisTurn check:');
    console.log('🔍 currentPlayer:', currentPlayer);
    console.log('🔍 gameState.players:', gameState.players);
    
    const player = gameState.players.find(p => p.id === currentPlayer.id);
    console.log('🔍 Found player in gameState:', player);
    console.log('🔍 player?.hasFlippedThisTurn:', player?.hasFlippedThisTurn);
    
    const result = player?.hasFlippedThisTurn || false;
    console.log('🔍 Final hasFlippedThisTurn result:', result);
    
    return result;
  };

  // Handle card flip
  const handleFlipCard = async () => {
    if (isFlipping || !isMyTurn() || hasFlippedThisTurn()) return;
    
    setIsFlipping(true);
    try {
      await flipCard();
      // Card flip logic will be handled by WebSocket events
    } catch (error) {
      console.error('Failed to flip card:', error);
    } finally {
      setIsFlipping(false);
    }
  };

  // Swipe gesture handlers
  const handleTouchStart = (e, playerId) => {
    if (!faceoff || (faceoff.player1 !== playerId && faceoff.player2 !== playerId)) return;
    setSwipeStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e, playerId) => {
    if (!faceoff || (faceoff.player1 !== playerId && faceoff.player2 !== playerId)) return;
    setSwipeEnd(e.touches[0].clientY);
  };

  const handleTouchEnd = (e, playerId) => {
    if (!faceoff || (faceoff.player1 !== playerId && faceoff.player2 !== playerId)) return;
    
    if (!swipeStart || !swipeEnd) return;
    
    const swipeDistance = swipeStart - swipeEnd;
    const minSwipeDistance = 50; // Minimum swipe distance
    
    if (swipeDistance > minSwipeDistance) {
      // Swipe up detected - this player lost
      console.log('🏆 Player swiped up - resolving faceoff for loser:', playerId);
      resolveFaceoff(playerId);
    }
    
    setSwipeStart(null);
    setSwipeEnd(null);
  };

  // Handle answer submission
  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;
    
    try {
      await submitAnswer(currentAnswer.trim(), getFaceOffCategory());
      setCurrentAnswer('');
      setShowAnswerInput(false);
      setFaceOffTimer(null);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  // Handle face-off timer
  useEffect(() => {
    if (gameStatus === 'faceoff' && !faceOffTimer) {
      setTimeLeft(30);
      setShowAnswerInput(true);
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up - auto-resolve
            setShowAnswerInput(false);
            setFaceOffTimer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStatus, faceOffTimer]);

  // Focus answer input when face-off starts
  useEffect(() => {
    if (showAnswerInput && answerInputRef.current) {
      answerInputRef.current.focus();
    }
  }, [showAnswerInput]);

  // Get current player's top card
  const getCurrentPlayerCard = () => {
    console.log('🔍 getCurrentPlayerCard called with gameState:', gameState);
    console.log('🔍 currentPlayer:', currentPlayer);
    
    if (!gameState) {
      console.log('❌ No gameState, returning null');
      return null;
    }
    
    if (!currentPlayer) {
      console.log('❌ No currentPlayer, returning null');
      return null;
    }
    
    if (!gameState.players) {
      console.log('❌ No gameState.players, returning null');
      return null;
    }
    
    const player = gameState.players.find(p => p.id === currentPlayer.id);
    console.log('🔍 Found player:', player);
    
    if (!player || !player.deck || player.deck.length === 0) {
      console.log('❌ Player not found or no cards in deck, returning null');
      return null;
    }
    
    // Return the top card (last card in deck)
    const topCard = player.deck[player.deck.length - 1];
    console.log('✅ Found top card:', topCard);
    return topCard;
  };

  // Get current matches
  const getCurrentMatches = () => {
    return gameState?.currentMatches || [];
  };

  // Check if current player is in a face-off
  const isInFaceOff = () => {
    const matches = getCurrentMatches();
    return matches.some(match => 
      match.player1 === currentPlayer?.id || match.player2 === currentPlayer?.id
    );
  };

  // Get face-off category
  const getFaceOffCategory = () => {
    const matches = getCurrentMatches();
    return matches[0]?.category || '';
  };

  // Get player scores
  const getPlayerScores = () => {
    console.log('🔍 getPlayerScores called with gameState:', gameState);
    console.log('🔍 gameState.players:', gameState?.players);
    
    if (!gameState) {
      console.log('❌ No gameState, returning empty array');
      return [];
    }
    
    if (!gameState.players) {
      console.log('❌ No gameState.players, returning empty array');
      return [];
    }
    
    const scores = gameState.players
      .map(player => ({
        id: player.id,
        name: player.name,
        score: player.score || 0
      }))
      .sort((a, b) => b.score - a.score);
    
    console.log('✅ Returning scores:', scores);
    return scores;
  };

  if (!gameState || !gameState.players || !currentPlayer) {
    console.log('🔄 Loading state - gameState:', !!gameState, 'players:', !!gameState?.players, 'currentPlayer:', !!currentPlayer);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="spinner mx-auto mb-4"></div>
          <p>Loading game...</p>
          <p className="text-sm text-gray-300 mt-2">
            {!gameState && 'Waiting for game state...'}
            {gameState && !gameState.players && 'Initializing players...'}
            {gameState && gameState.players && !currentPlayer && 'Setting up player...'}
          </p>
        </div>
      </div>
    );
  }

  // Faceoff UI
  if (faceoff) {
    const player1 = gameState.players.find(p => p.id === faceoff.player1);
    const player2 = gameState.players.find(p => p.id === faceoff.player2);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-4xl w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Faceoff Announcement */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">⚡ FACE-OFF!</h2>
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-2xl font-bold text-white">{player1?.name}</div>
              <div className="text-3xl font-bold text-yellow-400">VS</div>
              <div className="text-2xl font-bold text-white">{player2?.name}</div>
            </div>
            <div className="text-lg text-gray-300 mb-4">
              First to shout the opponent's category wins!
            </div>
            <div className="text-2xl font-bold text-yellow-400">
              3... 2... 1... GO!
            </div>
          </div>

          {/* Swipe Instructions */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Who won the faceoff?</h3>
            <div className="text-lg text-gray-300 mb-6">
              Loser swipes up on their card to give it away
            </div>
          </div>

          {/* Faceoff Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Player 1 Card */}
            <div 
              className="swipeable-card bg-white/20 backdrop-blur-lg rounded-xl p-6 cursor-pointer transition-transform hover:scale-105"
              onTouchStart={(e) => handleTouchStart(e, player1.id)}
              onTouchMove={(e) => handleTouchMove(e, player1.id)}
              onTouchEnd={(e) => handleTouchEnd(e, player1.id)}
            >
              <div className="card-content">
                <div className="text-6xl mb-4">
                  {faceoff.player1Card?.shape === 'circle' && '⭕'}
                  {faceoff.player1Card?.shape === 'square' && '⬜'}
                  {faceoff.player1Card?.shape === 'triangle' && '🔺'}
                  {faceoff.player1Card?.shape === 'diamond' && '💎'}
                  {faceoff.player1Card?.shape === 'star' && '⭐'}
                  {faceoff.player1Card?.shape === 'heart' && '❤️'}
                  {faceoff.player1Card?.shape === 'hexagon' && '⬡'}
                  {faceoff.player1Card?.shape === 'pentagon' && '⬟'}
                </div>
                <div className="text-xl font-bold text-white mb-2">{player1?.name}</div>
                <div className="text-lg text-gray-300">{faceoff.player1Card?.category}</div>
              </div>
              <div className="swipe-instruction mt-4">
                <span className="text-sm text-yellow-400">👆 Swipe up if you lost</span>
              </div>
            </div>

            {/* Player 2 Card */}
            <div 
              className="swipeable-card bg-white/20 backdrop-blur-lg rounded-xl p-6 cursor-pointer transition-transform hover:scale-105"
              onTouchStart={(e) => handleTouchStart(e, player2.id)}
              onTouchMove={(e) => handleTouchMove(e, player2.id)}
              onTouchEnd={(e) => handleTouchEnd(e, player2.id)}
            >
              <div className="card-content">
                <div className="text-6xl mb-4">
                  {faceoff.player2Card?.shape === 'circle' && '⭕'}
                  {faceoff.player2Card?.shape === 'square' && '⬜'}
                  {faceoff.player2Card?.shape === 'triangle' && '🔺'}
                  {faceoff.player2Card?.shape === 'diamond' && '💎'}
                  {faceoff.player2Card?.shape === 'star' && '⭐'}
                  {faceoff.player2Card?.shape === 'heart' && '❤️'}
                  {faceoff.player2Card?.shape === 'hexagon' && '⬡'}
                  {faceoff.player2Card?.shape === 'pentagon' && '⬟'}
                </div>
                <div className="text-xl font-bold text-white mb-2">{player2?.name}</div>
                <div className="text-lg text-gray-300">{faceoff.player2Card?.category}</div>
              </div>
              <div className="swipe-instruction mt-4">
                <span className="text-sm text-yellow-400">👆 Swipe up if you lost</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Game Header */}
        <motion.header 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Round {gameState.currentRound || 1}
          </h1>
          <div className="flex items-center justify-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{players.length} Players</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>Best Score: {Math.max(...getPlayerScores().map(p => p.score))}</span>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Player List & Scores */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Players & Scores</h3>
              <div className="space-y-3">
                {getPlayerScores().map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <span className={`text-sm ${
                        player.id === currentPlayer?.id ? 'text-yellow-400 font-bold' : 'text-white'
                      }`}>
                        {player.name}
                      </span>
                    </div>
                    <span className="text-white font-bold">{player.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Center - Game Area */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Current Player's Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                Your Current Card
              </h3>
              
              <div className="text-center">
                {getCurrentPlayerCard() ? (
                  <motion.div
                    className="game-card rounded-xl p-8 mx-auto max-w-sm"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-6xl mb-4">
                      {getCurrentPlayerCard().shape === 'circle' && '⭕'}
                      {getCurrentPlayerCard().shape === 'square' && '⬜'}
                      {getCurrentPlayerCard().shape === 'triangle' && '🔺'}
                      {getCurrentPlayerCard().shape === 'diamond' && '💎'}
                      {getCurrentPlayerCard().shape === 'star' && '⭐'}
                      {getCurrentPlayerCard().shape === 'heart' && '❤️'}
                      {getCurrentPlayerCard().shape === 'hexagon' && '⬡'}
                      {getCurrentPlayerCard().shape === 'pentagon' && '⬟'}
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-2">
                      {getCurrentPlayerCard().category}
                    </h4>
                    <p className="text-white/80 text-sm">
                      {getCurrentPlayerCard().difficulty} difficulty
                    </p>
                  </motion.div>
                ) : (
                  <div className="text-center text-gray-400">
                    <p>No card yet</p>
                  </div>
                )}
                
                {/* Turn Status */}
                <div className="mt-4 mb-2">
                  {isMyTurn() ? (
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400 mb-2">
                        🎯 It's Your Turn!
                      </div>
                      {hasFlippedThisTurn() && (
                        <div className="text-sm text-gray-400">
                          You've already flipped a card this turn
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-400 mb-2">
                        ⏳ Waiting for your turn...
                      </div>
                      {gameState?.currentPlayerId && (
                        <div className="text-sm text-gray-500">
                          {gameState.players.find(p => p.id === gameState.currentPlayerId)?.name}'s turn
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleFlipCard}
                  disabled={isFlipping || gameStatus === 'faceoff' || !isMyTurn() || hasFlippedThisTurn()}
                  className={`mt-2 px-8 py-3 rounded-lg font-bold transition-all duration-200 ${
                    isFlipping || gameStatus === 'faceoff' || !isMyTurn() || hasFlippedThisTurn()
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                  }`}
                >
                  {isFlipping ? (
                    <>
                      <div className="spinner inline mr-2"></div>
                      Flipping...
                    </>
                  ) : hasFlippedThisTurn() ? (
                    <>
                      <CheckCircle className="w-5 h-5 inline mr-2" />
                      Already Flipped
                    </>
                  ) : !isMyTurn() ? (
                    <>
                      <Clock className="w-5 h-5 inline mr-2" />
                      Not Your Turn
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 inline mr-2" />
                      Flip Card
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Face-off Area */}
            {gameStatus === 'faceoff' && (
              <motion.div
                className="faceoff-card rounded-2xl p-6 border-2 border-yellow-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    🚨 FACE-OFF! 🚨
                  </h3>
                  <p className="text-white text-lg mb-4">
                    Category: <span className="font-bold text-yellow-300">{getFaceOffCategory()}</span>
                  </p>
                  
                  {isInFaceOff() && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-white mb-2">
                          <Clock className="w-5 h-5" />
                          <span className="text-xl font-bold">{timeLeft}s</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${(timeLeft / 30) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="max-w-md mx-auto">
                        <input
                          ref={answerInputRef}
                          type="text"
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          placeholder="Type your answer..."
                          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center text-lg"
                          onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                        />
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={!currentAnswer.trim()}
                          className="w-full mt-3 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          <CheckCircle className="w-5 h-5 inline mr-2" />
                          Submit Answer
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {!isInFaceOff() && (
                    <div className="text-center text-white">
                      <p>Waiting for players to answer...</p>
                      <div className="spinner mx-auto mt-4"></div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Game Status */}
            {gameStatus === 'active' && (
              <motion.div
                className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-green-300 font-semibold">
                  Game in progress - Flip cards to find matches!
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Right Column - Game Info & Actions */}
          <motion.div 
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Game Progress */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Game Progress</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Round:</span>
                  <span className="text-white">{gameState.currentRound || 1} / 5</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-semibold ${
                    gameStatus === 'active' ? 'text-green-400' :
                    gameStatus === 'faceoff' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>
                    {gameStatus === 'active' ? 'Active' :
                     gameStatus === 'faceoff' ? 'Face-off!' :
                     'Waiting'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cards in Deck:</span>
                  <span className="text-white">{gameState.deck?.length || 0}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/lobby/${roomCode}`)}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors text-sm"
                >
                  <Users className="w-4 h-4 inline mr-2" />
                  Back to Lobby
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors text-sm"
                >
                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Refresh Game
                </button>
              </div>
            </div>

            {/* Game Rules */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">How to Play</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>• Flip cards to reveal categories</p>
                <p>• When cards match, race to answer!</p>
                <p>• First correct answer gets a point</p>
                <p>• Play 5 rounds to win</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GamePlay; 