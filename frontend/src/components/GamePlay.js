import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import AnomiaShape from './AnomiaShape';
import { 
  Play, 
  Trophy, 
  Clock, 
  CheckCircle,
  RotateCcw,
  X,
  Star
} from 'lucide-react';
import './GamePlay.css';

const GamePlay = () => {
  const { 
    gameState, 
    currentPlayer, 
    flipCard, 
    submitAnswer,
    gameStatus,
    faceoff,
    exitGame,
    startGame,
    state
  } = useGame();
  
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);

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
    try {
      console.log('🔄 handleFlipCard called');
      console.log('🔄 isFlipping:', isFlipping);
      
      console.log('🔄 Checking isMyTurn()...');
      const myTurn = isMyTurn();
      console.log('🔄 isMyTurn():', myTurn);
      
      console.log('🔄 Checking hasFlippedThisTurn()...');
      const hasFlipped = hasFlippedThisTurn();
      console.log('🔄 hasFlippedThisTurn():', hasFlipped);
      
      console.log('🔄 gameStatus:', gameStatus);
      console.log('🔄 state.socket:', state.socket);
      console.log('🔄 state.socket?.readyState:', state.socket?.readyState);
      
      if (isFlipping || !myTurn || hasFlipped) {
        console.log('❌ Flip card blocked by conditions');
        console.log('❌ isFlipping:', isFlipping);
        console.log('❌ !myTurn:', !myTurn);
        console.log('❌ hasFlipped:', hasFlipped);
        return;
      }
      
      console.log('✅ Flip card conditions passed, proceeding...');
      setIsFlipping(true);
      
      console.log('🔄 Calling flipCard()...');
      await flipCard();
      console.log('✅ flipCard() called successfully');
      // Card flip logic will be handled by WebSocket events
    } catch (error) {
      console.error('❌ Error in handleFlipCard:', error);
      console.error('❌ Error stack:', error.stack);
    } finally {
      setIsFlipping(false);
    }
  };

  // Swipe gesture handlers - REMOVED (using buttons instead)
  // const handleTouchStart = (e, playerId) => { ... }
  // const handleTouchMove = (e, playerId) => { ... }
  // const handleTouchEnd = (e, playerId) => { ... }
  // const handleCardClick = (playerId) => { ... }

  // Handle answer submission (currently unused - submitAnswer called directly)
  // eslint-disable-next-line no-unused-vars
  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) return;
    
    try {
      await submitAnswer(currentAnswer.trim(), getFaceOffCategory());
      setCurrentAnswer('');
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  // Handle "I Lost" button press
  const handleILost = async () => {
    try {
      console.log('🔄 Player claims they lost');
      
      // Send WebSocket message to backend
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        const message = {
          type: "resolveFaceoff",
          loserId: currentPlayer.id
        };
        
        console.log('📤 Sending WebSocket message:', message);
        state.socket.send(JSON.stringify(message));
        console.log('✅ "I Lost" message sent successfully');
      } else {
        console.error('❌ WebSocket not connected');
        // Could show a toast notification here: "Connection lost, please refresh"
      }
      
    } catch (error) {
      console.error('❌ Failed to claim loss:', error);
    }
  };

  // Handle face-off timer - DISABLED: No visual face-off indicators
  // useEffect(() => {
  //   if (gameStatus === 'faceoff' && !faceOffTimer) {
  //     setTimeLeft(30);
  //     setShowAnswerInput(true);
  //     
  //     timerRef.current = setInterval(() => {
  //       setTimeLeft(prev => {
  //         if (prev <= 1) {
  //           // Time's up - auto-resolve
  //           setShowAnswerInput(false);
  //           setFaceOffTimer(null);
  //           return 0;
  //         }
  //         return prev - 1;
  //       });
  //     }, 1000);
  //   }

  //   return () => {
  //     if (timerRef.current) {
  //       clearInterval(timerRef.current);
  //     }
  //   };
  // }, [gameStatus, faceOffTimer]);

  // Focus answer input when face-off starts - DISABLED: No visual face-off
  // useEffect(() => {
  //   if (showAnswerInput && answerInputRef.current) {
  //     answerInputRef.current.focus();
  //   }
  // }, [showAnswerInput]);

  // Get current player's top card
  const getCurrentPlayerCard = () => {
    console.log('🔍 getCurrentPlayerCard called with gameState:', gameState);
    console.log('🔍 currentPlayer:', currentPlayer);
    console.log('🔍 Wild card banner state:', { wildCardMessage: state.wildCardMessage, currentWildCard: gameState?.currentWildCard });
    
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
  // Check if currently in a faceoff (currently unused)
  // eslint-disable-next-line no-unused-vars
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="bg-card border-[4px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-8 max-w-md mx-auto">
          <div className="spinner mx-auto mb-4"></div>
            <p className="font-heading text-lg text-foreground mb-2">LOADING GAME...</p>
            <p className="font-sans text-sm text-muted-foreground">
            {!gameState && 'Waiting for game state...'}
            {gameState && !gameState.players && 'Initializing players...'}
            {gameState && gameState.players && !currentPlayer && 'Setting up player...'}
          </p>
          </div>
        </div>
      </div>
    );
  }

  // Show game over screen if game is completed
  if (gameStatus === 'completed' || gameState?.status === 'completed') {
    const isHost = currentPlayer?.isHost;
    const winner = gameState?.winner;
    const finalScores = gameState?.finalScores || [];
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
        <div className="max-w-2xl w-full mx-auto">
          <div className="bg-card border-[4px] border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] p-8 md:p-12">
            <div className="text-center mb-8 pb-6 border-b-[3px] border-foreground">
              <Trophy className="w-16 h-16 md:w-20 md:h-20 text-primary mx-auto mb-4" />
              <h1 className="font-heading text-2xl md:text-4xl text-primary leading-tight">GAME OVER!</h1>
            </div>
            
            {winner && (
              <div className="mb-8">
                <div className="text-center mb-4">
                  <div className="bg-accent border-[3px] border-foreground px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] inline-block">
                    <p className="font-heading text-foreground">★ WINNER ★</p>
                  </div>
                </div>
                <div className="bg-accent/20 border-[3px] border-accent p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] text-center">
                  <p className="font-heading text-2xl md:text-3xl text-accent mb-3">{winner.name}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-heading text-accent">{winner.finalScore}</span>
                    <span className="font-sans text-foreground/70">{winner.finalScore === 1 ? 'point' : 'points'}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-8">
              <h2 className="font-heading text-xl md:text-2xl text-foreground mb-6 pb-3 border-b-[3px] border-foreground text-center">FINAL SCORES</h2>
              <div className="space-y-3">
                {finalScores.map((player, index) => (
                  <div 
                    key={player.playerId}
                    className={`flex justify-between items-center p-4 border-[3px] ${
                      index === 0 ? 'bg-accent/30 border-accent' : 'bg-background border-foreground'
                    } shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]`}
                  >
                    <div className="flex items-center gap-3">
                      {index === 0 && <Star className="w-5 h-5 text-accent fill-accent" />}
                      <span className="font-heading text-foreground">{index + 1}.</span>
                      <span className="font-sans text-foreground/90">{player.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading text-foreground">{player.finalScore}</span>
                      <span className="font-sans text-foreground/60">{player.finalScore === 1 ? 'pt' : 'pts'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {isHost && (
              <button
                onClick={() => startGame()}
                className="w-full px-8 py-4 bg-primary text-white font-heading border-[4px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] hover:bg-primary/90 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] transition-all flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5" />
                PLAY AGAIN
              </button>
            )}
            
            {!isHost && (
              <p className="font-sans text-muted-foreground text-center">
                Waiting for host to start a new game...
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Debug faceoff state
  console.log('🔍 Faceoff state check:', {
    faceoff: faceoff,
    gameStateStatus: gameState?.status,
    gameStateFaceoff: gameState?.currentFaceoff
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Exit Button - Top Right */}
      <button
        onClick={exitGame}
        className="fixed top-4 right-4 z-50 p-2 bg-background border-[3px] border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:bg-muted hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all"
        title="Exit Game"
      >
        <X className="w-5 h-5 text-foreground" />
      </button>

      {/* Wild Card Banner - At top */}
      {gameState?.currentWildCard && (
        <motion.div 
          className="w-full max-w-md mx-auto px-4 mb-2 pt-4"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="bg-[rgba(166,27,134,0.05)] border-[3px] border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] p-1 flex items-center justify-center gap-4 h-[61px]">
            <span className="text-[9px] font-heading text-primary uppercase tracking-[0.9px]">
              Wild Card
            </span>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center">
                {gameState?.currentWildCard?.wild_shapes?.[0] ? (
                  <AnomiaShape 
                    shape={gameState.currentWildCard.wild_shapes[0]} 
                    size={32} 
                    color={
                      gameState.currentWildCard.wild_shapes[0] === 'circle' ? '#3B82F6' :
                      gameState.currentWildCard.wild_shapes[0] === 'square' ? '#E8A54A' :
                      gameState.currentWildCard.wild_shapes[0] === 'plus' ? '#9333EA' :
                      gameState.currentWildCard.wild_shapes[0] === 'waves' ? '#06B6D4' :
                      gameState.currentWildCard.wild_shapes[0] === 'diamond' ? '#FF7F50' :
                      gameState.currentWildCard.wild_shapes[0] === 'asterisk' ? '#EF4444' :
                      gameState.currentWildCard.wild_shapes[0] === 'dots' ? '#EC4899' :
                      gameState.currentWildCard.wild_shapes[0] === 'equals' ? '#84CC16' :
                      '#ffffff'
                    }
                  />
                ) : (
                  <span className="text-foreground">?</span>
                )}
              </div>
              <span className="text-lg font-heading text-primary">=</span>
              <div className="w-8 h-8 flex items-center justify-center">
                {gameState?.currentWildCard?.wild_shapes?.[1] ? (
                  <AnomiaShape 
                    shape={gameState.currentWildCard.wild_shapes[1]} 
                    size={32} 
                    color={
                      gameState.currentWildCard.wild_shapes[1] === 'circle' ? '#3B82F6' :
                      gameState.currentWildCard.wild_shapes[1] === 'square' ? '#E8A54A' :
                      gameState.currentWildCard.wild_shapes[1] === 'plus' ? '#9333EA' :
                      gameState.currentWildCard.wild_shapes[1] === 'waves' ? '#06B6D4' :
                      gameState.currentWildCard.wild_shapes[1] === 'diamond' ? '#FF7F50' :
                      gameState.currentWildCard.wild_shapes[1] === 'asterisk' ? '#EF4444' :
                      gameState.currentWildCard.wild_shapes[1] === 'dots' ? '#EC4899' :
                      gameState.currentWildCard.wild_shapes[1] === 'equals' ? '#84CC16' :
                      '#ffffff'
                    }
                  />
                ) : (
                  <span className="text-foreground">?</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Game Area - Card and Buttons */}
      <div className="flex flex-col items-center justify-center px-4 py-0 pb-6 min-h-[calc(100vh-200px)]">
        {/* Current Player's Card - Large and Prominent */}
        <div className="w-full max-w-md mb-4">
          {getCurrentPlayerCard() ? (
            <motion.div
              className={`border-[4px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-4 mx-auto ${gameState?.currentWildCard ? 'h-[485px] md:h-[485px]' : 'aspect-[2/3]'} flex flex-col justify-between ${

                getCurrentPlayerCard().is_wild 
                  ? 'bg-gradient-to-br from-[oklch(0.75_0.15_60)] via-[oklch(0.65_0.2_350)] to-[oklch(0.55_0.18_310)] wild-card-float' 
                  : 'bg-primary'
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Top Category Text - Upside Down */}
              <div className="text-center px-2">
                {!getCurrentPlayerCard().is_wild && (() => {
                  const category = getCurrentPlayerCard().category;
                  const words = category ? category.split(' ') : [];
                  const longestWordLength = words.length > 0
                    ? Math.max(...words.map(word => word.length))
                    : 0;
                  const wordCount = words.length;
                  // For multi-word categories, use smaller font sizes
                  const fontSize = longestWordLength > 12 
                    ? 'text-xl' 
                    : longestWordLength > 9 
                    ? 'text-2xl'
                    : longestWordLength > 7
                    ? 'text-3xl'
                    : wordCount >= 3 && longestWordLength <= 7
                    ? 'text-2xl'
                    : longestWordLength > 5
                    ? 'text-3xl'
                    : 'text-4xl';
                  return (
                    <h4 className={`font-heading text-white mb-4 text-center transform rotate-180 break-words ${fontSize}`} style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                      {category}
                </h4>
                  );
                })()}
              </div>

              {/* Center Symbol */}
              <div className="flex justify-center items-center flex-1">
                {getCurrentPlayerCard().is_wild ? (
                  <div className="flex flex-col items-center justify-between h-full w-full">
                    {/* Top text (upside down) */}
                    <div className="font-heading font-bold text-white text-3xl text-center tracking-wider drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)] rotate-180">
                      WILD CARD
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-6">
                      {/* Wild card shapes with equals sign */}
                      <div className="flex items-center gap-4">
                    <AnomiaShape 
                      shape={getCurrentPlayerCard().wild_shapes?.[0]} 
                          size={110}
                          color={
                            getCurrentPlayerCard().wild_shapes?.[0] === 'circle' ? '#3B82F6' :
                            getCurrentPlayerCard().wild_shapes?.[0] === 'square' ? '#E8A54A' :
                            getCurrentPlayerCard().wild_shapes?.[0] === 'plus' ? '#9333EA' :
                            getCurrentPlayerCard().wild_shapes?.[0] === 'waves' ? '#06B6D4' :
                            getCurrentPlayerCard().wild_shapes?.[0] === 'diamond' ? '#FF7F50' :
                            getCurrentPlayerCard().wild_shapes?.[0] === 'asterisk' ? '#EF4444' :
                            getCurrentPlayerCard().wild_shapes?.[0] === 'dots' ? '#EC4899' :
                            getCurrentPlayerCard().wild_shapes?.[0] === 'equals' ? '#84CC16' :
                            '#ffffff'
                          }
                        />
                        <span className="text-2xl font-heading font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                          =
                        </span>
                    <AnomiaShape 
                      shape={getCurrentPlayerCard().wild_shapes?.[1]} 
                          size={110}
                          color={
                            getCurrentPlayerCard().wild_shapes?.[1] === 'circle' ? '#3B82F6' :
                            getCurrentPlayerCard().wild_shapes?.[1] === 'square' ? '#E8A54A' :
                            getCurrentPlayerCard().wild_shapes?.[1] === 'plus' ? '#9333EA' :
                            getCurrentPlayerCard().wild_shapes?.[1] === 'waves' ? '#06B6D4' :
                            getCurrentPlayerCard().wild_shapes?.[1] === 'diamond' ? '#FF7F50' :
                            getCurrentPlayerCard().wild_shapes?.[1] === 'asterisk' ? '#EF4444' :
                            getCurrentPlayerCard().wild_shapes?.[1] === 'dots' ? '#EC4899' :
                            getCurrentPlayerCard().wild_shapes?.[1] === 'equals' ? '#84CC16' :
                            '#ffffff'
                          }
                        />
                      </div>
                    </div>

                    {/* Bottom text (right-side up) */}
                    <div className="font-heading font-bold text-white text-3xl text-center tracking-wider drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                      WILD CARD
                    </div>
                  </div>
                ) : (
                  <AnomiaShape 
                    shape={getCurrentPlayerCard().shape} 
                    size={140} 
         color={
           getCurrentPlayerCard().shape === 'circle' ? '#3B82F6' :
           getCurrentPlayerCard().shape === 'square' ? '#E8A54A' :
           getCurrentPlayerCard().shape === 'plus' ? '#9333EA' :
           getCurrentPlayerCard().shape === 'waves' ? '#06B6D4' :
           getCurrentPlayerCard().shape === 'diamond' ? '#FF7F50' :
           getCurrentPlayerCard().shape === 'asterisk' ? '#EF4444' :
           getCurrentPlayerCard().shape === 'dots' ? '#EC4899' :
           getCurrentPlayerCard().shape === 'equals' ? '#84CC16' :
           '#ffffff'
         }
                  />
                )}
              </div>

              {/* Bottom Category Text - Right Side Up */}
              <div className="text-center px-2">
                {!getCurrentPlayerCard().is_wild && (() => {
                  const category = getCurrentPlayerCard().category;
                  const words = category ? category.split(' ') : [];
                  const longestWordLength = words.length > 0
                    ? Math.max(...words.map(word => word.length))
                    : 0;
                  const wordCount = words.length;
                  // For multi-word categories, use smaller font sizes
                  const fontSize = longestWordLength > 12 
                    ? 'text-xl' 
                    : longestWordLength > 9 
                    ? 'text-2xl'
                    : longestWordLength > 7
                    ? 'text-3xl'
                    : wordCount >= 3 && longestWordLength <= 7
                    ? 'text-2xl'
                    : longestWordLength > 5
                    ? 'text-3xl'
                    : 'text-4xl';
                  return (
                    <h4 className={`font-heading text-white mb-4 text-center break-words ${fontSize}`} style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.5)' }}>
                      {category}
                </h4>
                  );
                })()}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className={`bg-background border-[4px] border-dashed border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-4 mx-auto ${gameState?.currentWildCard ? 'h-[465px]' : 'aspect-[2/3]'} flex flex-col justify-center items-center`}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto border-[3px] border-dashed border-foreground rounded-lg flex items-center justify-center">
                    <span className="text-2xl text-muted-foreground">?</span>
                  </div>
                </div>
                <h4 className="font-heading text-muted-foreground text-xl mb-2">
                  NO CARD YET
                </h4>
                <p className="font-sans text-muted-foreground text-sm">
                  Draw a card to start playing
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-6">
          {/* Flip Card Button */}
          <button
            onClick={(e) => {
              console.log('🖱️ Button clicked!');
              console.log('🖱️ Event:', e);
              console.log('🖱️ Button disabled?', e.target.disabled);
              console.log('🖱️ Button className:', e.target.className);
              try {
                console.log('🔄 About to call handleFlipCard...');
                handleFlipCard();
                console.log('✅ handleFlipCard called successfully');
              } catch (error) {
                console.error('❌ Error calling handleFlipCard:', error);
              }
            }}
            disabled={isFlipping || !isMyTurn() || hasFlippedThisTurn()}
            className={`w-full py-4 px-6 font-heading text-lg transition-all duration-200 border-[4px] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] ${
              isFlipping || !isMyTurn() || hasFlippedThisTurn()
                ? 'bg-muted text-muted-foreground border-foreground cursor-not-allowed'
                : 'bg-accent text-white border-foreground hover:bg-accent/90 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]'
            }`}
          >
            {isFlipping ? (
              <>
                <div className="spinner inline mr-2"></div>
                FLIPPING...
              </>
            ) : hasFlippedThisTurn() ? (
              <>
                <CheckCircle className="w-5 h-5 inline mr-2" />
                {getCurrentPlayerCard()?.is_wild ? "WILD CARD! DRAW NEXT" : "DRAW"}
              </>
            ) : !isMyTurn() ? (
              <>
                <Clock className="w-5 h-5 inline mr-2" />
                DRAW
              </>
            ) : (
              <>
                <Play className="w-5 h-5 inline mr-2" />
                DRAW 
              </>
            )}
          </button>

          {/* "I Lost" Button */}
          <button
            onClick={handleILost}
            className="w-full py-4 px-6 font-heading text-lg transition-all duration-200 border-[4px] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] bg-destructive text-white border-foreground hover:bg-destructive/90 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]"
          >
            <RotateCcw className="w-5 h-5 inline mr-2" />
            I LOST
          </button>

          {/* Score Card - Below I LOST Button */}
          <motion.div 
            className="w-full max-w-md text-center px-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-background border-[4px] md:border-[6px] border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] px-6 md:px-12 py-3 md:py-6">
              <div className="text-center">
                <h1 className="font-heading text-3xl md:text-4xl text-primary tracking-wider md:tracking-widest mb-4">
                  SCORES
                </h1>
                <div className="flex justify-center items-center gap-4 md:gap-6">
                  {getPlayerScores().slice(0, 3).map((player, index) => (
                    <div key={player.id} className="flex flex-col items-center">
                      <div className={`w-8 h-8 md:w-10 md:h-10 border-[3px] border-foreground flex items-center justify-center text-sm md:text-base font-heading text-center ${
                        player.id === currentPlayer?.id ? 'bg-accent text-white' : 
                        'bg-background text-foreground'
                      }`}>
                        {player.score}
                      </div>
                       <span className="font-sans text-sm md:text-base text-foreground font-bold mt-1">
                        {player.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>


    </div>
  );
};

export default GamePlay;
