import React, { createContext, useContext, useReducer, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// LocalStorage helpers
const STORAGE_KEY = 'anomia_game_state';

const saveGameStateToStorage = (state) => {
  try {
    const stateToSave = {
      roomCode: state.currentRoom?.roomCode,
      playerId: state.currentPlayer?.id,
      playerName: state.currentPlayer?.name,
      gameState: state.gameState,
      gameStatus: state.gameStatus,
      players: state.players,
      timestamp: Date.now()
    };
    
    // Only save if we have at least a room code
    if (stateToSave.roomCode) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      console.log('💾 Saved game state to localStorage:', stateToSave);
    }
  } catch (error) {
    console.error('❌ Error saving game state to localStorage:', error);
  }
};

const loadGameStateFromStorage = () => {
  try {
    // Check if user explicitly exited (don't restore)
    const exitFlag = localStorage.getItem('anomia_exit_flag');
    if (exitFlag === 'true') {
      console.log('🚪 Exit flag detected, skipping restore');
      localStorage.removeItem('anomia_exit_flag');
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('📂 Loaded game state from localStorage:', parsed);
      
      // Check if state is less than 24 hours old (prevent stale data)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - parsed.timestamp < maxAge) {
        return parsed;
      } else {
        console.log('⏰ Saved state is too old, clearing...');
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  } catch (error) {
    console.error('❌ Error loading game state from localStorage:', error);
    localStorage.removeItem(STORAGE_KEY);
  }
  return null;
};

const clearGameStateFromStorage = (setExitFlag = false) => {
  try {
    if (setExitFlag) {
      localStorage.setItem('anomia_exit_flag', 'true');
    }
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ Cleared game state from localStorage', setExitFlag ? '(with exit flag)' : '');
  } catch (error) {
    console.error('❌ Error clearing game state from localStorage:', error);
  }
};

// Game state reducer
const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SOCKET':
      console.log('🔄 SET_SOCKET action:', action.payload);
      console.log('🔄 State before SET_SOCKET:', state);
      const newStateAfterSocket = { ...state, socket: action.payload };
      console.log('✅ State after SET_SOCKET:', newStateAfterSocket);
      return newStateAfterSocket;
    
    case 'SET_ROOM':
      console.log('🔄 SET_ROOM action:', action.payload);
      console.log('🔄 State before SET_ROOM:', state);
      console.log('🔄 Current socket in state:', state.socket);
      const newStateAfterRoom = { 
        ...state, 
        currentRoom: action.payload,
        players: action.payload?.players || [],
        socket: state.socket  // Preserve כי socket!
      };
      console.log('✅ State after SET_ROOM:', newStateAfterRoom);
      console.log('✅ Socket preserved:', newStateAfterRoom.socket);
      return newStateAfterRoom;
    
    case 'SET_PLAYER':
      console.log('🔄 SET_PLAYER action:', action.payload);
      console.log('🔄 State before SET_PLAYER:', state);
      const newStateAfterPlayer = { 
        ...state, 
        currentPlayer: action.payload       
      };
      console.log('✅ State after SET_PLAYER:', newStateAfterPlayer);
      return newStateAfterPlayer;
    
    case 'SET_GAME_STATE':
      console.log('🔄 SET_GAME_STATE action:', action.payload);
      return { ...state, gameState: action.payload };
    
    case 'SET_PLAYERS':
      console.log('🔄 SET_PLAYERS action:', action.payload);
      console.log('🔄 State before update:', state);
      const newState = { ...state, players: action.payload };
      console.log('✅ State after update:', newState);
      return newState;
    
    case 'SET_GAME_STATUS':
      return { ...state, gameStatus: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'UPDATE_SCORE':
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.payload.playerId
            ? { ...player, score: action.payload.score }
            : player
        )
      };
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    
    case 'SET_FACEOFF':
      return {
        ...state,
        faceoff: action.payload
      };
    
    case 'CLEAR_FACEOFF':
      return {
        ...state,
        faceoff: null
      };
    
    case 'SET_WILD_CARD_MESSAGE':
      return {
        ...state,
        wildCardMessage: action.payload
      };
    
    case 'CLEAR_WILD_CARD_MESSAGE':
      return {
        ...state,
        wildCardMessage: null
      };
    
    case 'RESET_GAME':
      return {
        ...state,
        gameState: null,
        gameStatus: 'waiting',
        messages: []
      };
    
    case 'RESTORE_STATE':
      return {
        ...state,
        currentRoom: action.payload.currentRoom,
        currentPlayer: action.payload.currentPlayer,
        gameState: action.payload.gameState,
        gameStatus: action.payload.gameStatus || 'waiting',
        players: action.payload.players || []
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  socket: null,
  currentRoom: null,
  currentPlayer: null,
  gameState: null,
  players: [],
  gameStatus: 'waiting', // waiting, active, faceoff, completed
  faceoff: null, // Current faceoff data
  wildCardMessage: null, // Message when wild card is drawn
  error: null,
  loading: false,
  messages: [],
  isConnected: false
};

// Create context
const GameContext = createContext();

// Provider component
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [isCreatingSocket, setIsCreatingSocket] = useState(false);
  const currentSocketRef = useRef(null);
  const hasCreatedSocketRef = useRef(false);
  const isRestoringRef = useRef(false);
  const isExitingRef = useRef(false);
  const currentPlayerRef = useRef(null);
  const currentRoomRef = useRef(null);
  const navigate = useNavigate();

  // Restore state from localStorage on mount
  useEffect(() => {
    const savedState = loadGameStateFromStorage();
    if (savedState && savedState.roomCode && savedState.playerId && savedState.playerName) {
      console.log('🔄 Restoring game state from localStorage...');
      isRestoringRef.current = true;
      
      // Reconstruct room and player objects
      const restoredRoom = {
        roomCode: savedState.roomCode,
        players: savedState.players || []
      };
      
      const restoredPlayer = {
        id: savedState.playerId,
        name: savedState.playerName
      };
      
      dispatch({
        type: 'RESTORE_STATE',
        payload: {
          currentRoom: restoredRoom,
          currentPlayer: restoredPlayer,
          gameState: savedState.gameState,
          gameStatus: savedState.gameStatus || 'waiting',
          players: savedState.players || []
        }
      });
      
      // Navigate to appropriate screen
      if (savedState.gameStatus === 'active' && savedState.gameState) {
        navigate(`/game/${savedState.roomCode}`);
      } else {
        navigate(`/waiting-room/${savedState.roomCode}`);
      }
    }
  }, []); // Only run on mount

  // Update refs whenever state changes
  useEffect(() => {
    currentPlayerRef.current = state.currentPlayer;
    currentRoomRef.current = state.currentRoom;
  }, [state.currentPlayer, state.currentRoom]);

  // Save state to localStorage whenever relevant state changes
  useEffect(() => {
    // Don't save during initial restoration
    if (isRestoringRef.current) {
      isRestoringRef.current = false;
      return;
    }
    
    // Don't save if we're exiting
    if (isExitingRef.current) {
      return;
    }
    
    // Only save if we have a room and player
    if (state.currentRoom?.roomCode && state.currentPlayer?.id) {
      saveGameStateToStorage(state);
    }
  }, [state.currentRoom?.roomCode, state.currentPlayer?.id, state.gameState, state.gameStatus, state.players]);

    // Initialize WebSocket connection when room is set
  useEffect(() => {
    console.log('🔌 useEffect triggered with currentRoom:', state.currentRoom?.roomCode);
    
    // Only create WebSocket if we have a room and don't have a working socket
    console.log('🔌 useEffect check:');
    console.log('🔌 currentRoom?.roomCode:', state.currentRoom?.roomCode);
    console.log('🔌 !state.socket:', !state.socket);
    console.log('🔌 !hasCreatedSocket:', !hasCreatedSocketRef.current);
    console.log('🔌 Should create WebSocket:', state.currentRoom?.roomCode && !state.socket && !hasCreatedSocketRef.current);
    
    if (state.currentRoom?.roomCode && !state.socket && !hasCreatedSocketRef.current) {
      console.log('🔌 Creating WebSocket connection for room:', state.currentRoom.roomCode);
      hasCreatedSocketRef.current = true;
      
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
      const wsUrl = backendUrl.replace('http', 'ws');
      const socket = new WebSocket(`${wsUrl}/ws/${state.currentRoom.roomCode}`);
      
      // Set socket in state
      console.log('🔌 Dispatching SET_SOCKET with WebSocket:', socket);
      dispatch({ type: 'SET_SOCKET', payload: socket });
      
      // Also update the ref so waitForSocket can access it
      currentSocketRef.current = socket;
      console.log('🔌 Updated currentSocketRef.current:', currentSocketRef.current);
      
      // WebSocket event listeners
      socket.onopen = () => {
        console.log('✅ WebSocket connected to Python backend');
        console.log('✅ WebSocket readyState:', socket.readyState);
        dispatch({ type: 'SET_LOADING', payload: false });
        
        // If we're restoring state, send a joinRoom message to reconnect
        const currentPlayer = currentPlayerRef.current;
        const currentRoom = currentRoomRef.current;
        if (currentPlayer?.name && currentRoom?.roomCode) {
          console.log('🔄 Reconnecting to room after restore...');
          socket.send(JSON.stringify({
            type: 'joinRoom',
            playerName: currentPlayer.name,
            roomCode: currentRoom.roomCode,
            playerId: currentPlayer.id // Include player ID for reconnection
          }));
        }
      };

      socket.onclose = (event) => {
        console.log('❌ WebSocket disconnected from Python backend');
        console.log('❌ Close event code:', event.code);
        console.log('❌ Close event reason:', event.reason);
        dispatch({ type: 'SET_LOADING', payload: true });
      };

      socket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Connection error' });
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('📨 Received WebSocket message:', message);
          
          switch (message.type) {
            case 'roomJoined':
              console.log('🎯 roomJoined received:', message.data);
              dispatch({ type: 'SET_ROOM', payload: message.data.room });
              // Set the current player with the proper backend-assigned ID
              if (message.data.player) {
                console.log('✅ Setting current player from roomJoined:', message.data.player);
                dispatch({ type: 'SET_PLAYER', payload: message.data.player });
              }
              break;
              
            case 'playerJoined':
              console.log('🎯 playerJoined received:', message.data);
              dispatch({ type: 'SET_PLAYERS', payload: message.data.room.players });
              break;
              
            case 'playerLeft':
              console.log('🎯 playerLeft received:', message.data);
              dispatch({ type: 'SET_PLAYERS', payload: message.data.players });
              dispatch({ type: 'SET_ROOM', payload: message.data.room });
              
              // Update current player if they became host
              const updatedPlayers = message.data.players;
              const currentPlayerId = state.currentPlayer?.id;
              const newHostPlayer = updatedPlayers.find(p => p.isHost);
              if (newHostPlayer && newHostPlayer.id === currentPlayerId) {
                console.log('👑 Current player is now the host');
                dispatch({ type: 'SET_PLAYER', payload: newHostPlayer });
              }
              break;
              
            case 'gameStarted':
              console.log('🎯 gameStarted received:', message);
              console.log('🎯 message.data:', message.data);
              console.log('🎯 message.data.gameState:', message.data.gameState);
              dispatch({ type: 'SET_GAME_STATE', payload: message.data.gameState });
              dispatch({ type: 'SET_GAME_STATUS', payload: 'active' });
              
              // Navigate to game screen for all players
              const roomCode = message.data.gameState.roomCode;
              console.log('🎮 Navigating to game screen for room:', roomCode);
              navigate(`/game/${roomCode}`);
              break;
              
            case 'cardFlipped':
              console.log('🃏 Card flipped event:', message.data);
              dispatch({ type: 'SET_GAME_STATE', payload: message.data.gameState });
              
              // Check if this was a wild card
              if (message.data.isWildCard) {
                console.log('🌟 Wild card detected in cardFlipped event:', message.data.message);
                dispatch({ type: 'SET_WILD_CARD_MESSAGE', payload: message.data.message });
                // Clear the message after 3 seconds
                setTimeout(() => {
                  dispatch({ type: 'CLEAR_WILD_CARD_MESSAGE' });
                }, 3000);
              }
              break;
              
            case 'wild_card_drawn':
              console.log('🌟 Wild card drawn:', message.data);
              dispatch({ type: 'SET_GAME_STATE', payload: message.data.gameState });
              dispatch({ type: 'SET_WILD_CARD_MESSAGE', payload: message.data.message });
              break;
              
            case 'answerSubmitted':
              dispatch({ type: 'SET_GAME_STATE', payload: message.data.gameState });
              break;
              
            case 'gameEnded':
              console.log('🏁 Game ended:', message.data);
              dispatch({ type: 'SET_GAME_STATE', payload: message.data.gameState });
              dispatch({ type: 'SET_GAME_STATUS', payload: 'completed' });
              break;
              
            case 'faceoffDetected':
              console.log('⚡ Faceoff detected:', message.data);
              dispatch({ type: 'SET_FACEOFF', payload: message.data.faceoff });
              dispatch({ type: 'SET_GAME_STATE', payload: message.data.gameState });
              dispatch({ type: 'SET_GAME_STATUS', payload: 'faceoff' });
              break;
              
            case 'faceoffResolved':
              console.log('🏆 Faceoff resolved:', message.data);
              dispatch({ type: 'SET_GAME_STATE', payload: message.data.gameState });
              dispatch({ type: 'CLEAR_FACEOFF' });
              dispatch({ type: 'SET_GAME_STATUS', payload: message.data.gameState.status });
              
              // Clear wild card message if wild card was involved in the faceoff
              if (message.data.wildCardInvolved) {
                dispatch({ type: 'CLEAR_WILD_CARD_MESSAGE' });
              }
              break;
              
            case 'error':
              dispatch({ type: 'SET_ERROR', payload: message.message });
              break;
              
            default:
              console.log('Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      // Cleanup function
      return () => {
        if (socket) {
          console.log('🧹 Cleaning up WebSocket connection');
          socket.close();
        }
      };
    }
  }, [state.currentRoom?.roomCode]); // Only run when roomCode changes

  // Actions
  const actions = {
    // Create a new room
    createRoom: async (hostName) => {
      try {
        console.log('🚀 createRoom called with hostName:', hostName);
        
        // Clear localStorage when creating a new room - always start fresh
        // Also clear exit flag if it exists
        localStorage.removeItem('anomia_exit_flag');
        clearGameStateFromStorage();
        
        // Ensure we're starting fresh - close any existing socket
        if (state.socket) {
          console.log('🧹 Closing existing socket before creating room...');
          try {
            state.socket.onopen = null;
            state.socket.onclose = null;
            state.socket.onerror = null;
            state.socket.onmessage = null;
            if (state.socket.readyState !== WebSocket.CLOSED && state.socket.readyState !== WebSocket.CLOSING) {
              state.socket.close();
            }
          } catch (error) {
            console.error('Error closing existing socket:', error);
          }
          // Clear the socket refs to allow new connection
          currentSocketRef.current = null;
          hasCreatedSocketRef.current = false;
          dispatch({ type: 'SET_SOCKET', payload: null });
        }
        
        // Clear any existing state when creating new room
        dispatch({ type: 'SET_ROOM', payload: null });
        dispatch({ type: 'SET_PLAYER', payload: null });
        dispatch({ type: 'RESET_GAME' });
        
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
        console.log('🌐 Making request to:', `${backendUrl}/api/rooms`);
        
        const response = await fetch(`${backendUrl}/api/rooms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ hostName }),
        });

        console.log('📡 Response status:', response.status);
        const data = await response.json();
        console.log('📦 Response data:', data);
        
        if (data.success) {
          console.log('✅ Room created successfully, dispatching SET_ROOM');
          dispatch({ type: 'SET_ROOM', payload: data.room });
          console.log('✅ Dispatching SET_PLAYER');
          dispatch({ type: 'SET_PLAYER', payload: data.room.players[0] });
          dispatch({ type: 'SET_LOADING', payload: false });
          return data;
        } else {
          console.log('❌ Room creation failed:', data.error);
          throw new Error(data.error || 'Failed to create room');
        }
      } catch (error) {
        console.error('💥 Error creating room:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        dispatch({ type: 'SET_LOADING', payload: false });
        throw error;
      }
    },

    // Join an existing room
    joinRoom: async (roomCode, playerName) => {
      try {
        console.log('🚀 joinRoom called with roomCode:', roomCode, 'playerName:', playerName);
        
        // Clear localStorage when joining a new room - always start fresh
        // Also clear exit flag if it exists
        localStorage.removeItem('anomia_exit_flag');
        clearGameStateFromStorage();
        
        // Ensure we're starting fresh - close any existing socket
        if (state.socket) {
          console.log('🧹 Closing existing socket before joining room...');
          try {
            state.socket.onopen = null;
            state.socket.onclose = null;
            state.socket.onerror = null;
            state.socket.onmessage = null;
            if (state.socket.readyState !== WebSocket.CLOSED && state.socket.readyState !== WebSocket.CLOSING) {
              state.socket.close();
            }
          } catch (error) {
            console.error('Error closing existing socket:', error);
          }
          currentSocketRef.current = null;
          hasCreatedSocketRef.current = false;
          dispatch({ type: 'SET_SOCKET', payload: null });
        }
        
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
        console.log('🌐 Making request to:', `${backendUrl}/api/rooms/${roomCode}`);
        
        const response = await fetch(`${backendUrl}/api/rooms/${roomCode}`);
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          console.log('❌ Room not found, response not ok');
          throw new Error('Room not found');
        }
        
        const room = await response.json();
        console.log('📦 Room data received:', room);
        
        // Set room state immediately so WebSocket can connect
        console.log('✅ Dispatching SET_ROOM for join (initial state)');
        dispatch({ type: 'SET_ROOM', payload: room });
        
        // Find existing player or wait for backend to assign proper ID
        let player = room.players.find(p => p.name === playerName);
        if (!player) {
          console.log('⏳ Player not found in room yet, waiting for WebSocket to assign proper ID');
          // Don't create a temporary player - wait for backend to assign proper ID
          // The WebSocket roomJoined message will handle setting the correct player
        } else {
          console.log('👤 Found existing player:', player);
          // Set player info only if we found an existing player
          console.log('✅ Dispatching SET_PLAYER for existing player');
          dispatch({ type: 'SET_PLAYER', payload: player });
        }
        
        // Don't trigger fallback immediately - let WebSocket work first
        console.log('⏳ Waiting for WebSocket to send join message...');
        
        // Wait for WebSocket to be ready, then send message
        const waitForSocket = () => {
          // Get the current socket from the ref (which is always up-to-date)
          const currentSocket = currentSocketRef.current;
          
          console.log('🔍 Checking WebSocket state:');
          console.log('🔍 currentSocket exists:', !!currentSocket);
          console.log('🔍 currentSocket.readyState:', currentSocket?.readyState);
          console.log('🔍 WebSocket.OPEN constant:', WebSocket.OPEN);
          console.log('🔍 Is socket ready?', currentSocket?.readyState === WebSocket.OPEN);
          
          if (currentSocket && currentSocket.readyState === WebSocket.OPEN) {
            console.log('📡 WebSocket ready! Sending joinRoom message');
            currentSocket.send(JSON.stringify({
              type: 'joinRoom',
              playerName: playerName,
              roomCode: roomCode
            }));
          } else {
            console.log('⏳ WebSocket not ready yet, waiting...');
            console.log('⏳ Socket state:', currentSocket?.readyState);
            console.log('⏳ Expected state:', WebSocket.OPEN);
            setTimeout(waitForSocket, 200);
          }
        };
        
        // Start waiting for socket
        console.log('⏰ Setting timeout for waitForSocket in 1 second...');
        console.log('⏰ Current socket state at timeout setup:', state.socket);
        setTimeout(waitForSocket, 1000);
        
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true, room };
      } catch (error) {
        console.error('💥 Error joining room:', error);
        dispatch({ type: 'SET_ERROR', payload: error.message });
        dispatch({ type: 'SET_LOADING', payload: false });
        throw error;
      }
    },

    // Start the game
    startGame: () => {
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        console.log('🎮 Starting game via WebSocket');
        state.socket.send(JSON.stringify({
          type: 'startGame'
        }));
      } else {
        console.error('❌ WebSocket not connected');
        dispatch({ type: 'SET_ERROR', payload: 'Not connected to server' });
      }
    },

    // Flip a card
    flipCard: () => {
      console.log('🔄 flipCard called');
      console.log('🔄 state.socket:', state.socket);
      console.log('🔄 state.socket?.readyState:', state.socket?.readyState);
      console.log('🔄 state.currentPlayer:', state.currentPlayer);
      
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        const message = {
          type: 'flipCard',
          playerId: state.currentPlayer?.id
        };
        console.log('📤 Sending flipCard message:', message);
        state.socket.send(JSON.stringify(message));
        console.log('✅ flipCard message sent');
      } else {
        console.log('❌ Cannot send flipCard message - socket not ready');
        console.log('❌ Socket state:', state.socket?.readyState);
        dispatch({ type: 'SET_ERROR', payload: 'Not connected to server' });
      }
    },

    // Submit an answer
    submitAnswer: (answer, category) => {
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        state.socket.send(JSON.stringify({
          type: 'submitAnswer',
          playerId: state.currentPlayer?.id,
          answer: answer,
          category: category
        }));
      }
    },

    // Resolve faceoff (when loser swipes up)
    resolveFaceoff: (loserId) => {
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        console.log('🏆 Resolving faceoff for loser:', loserId);
        state.socket.send(JSON.stringify({
          type: 'resolveFaceoff',
          loserId: loserId
        }));
      }
    },

    // Clear error
    clearError: () => {
      dispatch({ type: 'CLEAR_ERROR' });
    },

    // Reset game
    resetGame: () => {
      // Clear exit flag when resetting
      localStorage.removeItem('anomia_exit_flag');
      dispatch({ type: 'RESET_GAME' });
      clearGameStateFromStorage();
    },

    // Exit game - leave the room and return to home
    exitGame: () => {
      console.log('🚪 Exiting game...');
      
      // Set exit flag FIRST to prevent saving state during exit
      isExitingRef.current = true;
      
      // Clear localStorage IMMEDIATELY to prevent restore on refresh
      // Set exit flag so restore won't run on refresh
      clearGameStateFromStorage(true);
      
      // Send leave message to backend if socket is connected
      const socketToClose = state.socket;
      if (socketToClose && socketToClose.readyState === WebSocket.OPEN && state.currentPlayer) {
        try {
          socketToClose.send(JSON.stringify({
            type: 'leaveRoom',
            playerId: state.currentPlayer.id,
            roomCode: state.currentRoom?.roomCode
          }));
        } catch (error) {
          console.error('Error sending leaveRoom message:', error);
        }
      }
      
      // Close socket connection and remove event listeners
      if (socketToClose) {
        try {
          // Remove all event listeners to prevent issues
          socketToClose.onopen = null;
          socketToClose.onclose = null;
          socketToClose.onerror = null;
          socketToClose.onmessage = null;
          
          // Only close if not already closed
          if (socketToClose.readyState !== WebSocket.CLOSED && socketToClose.readyState !== WebSocket.CLOSING) {
            socketToClose.close();
          }
        } catch (error) {
          console.error('Error closing socket:', error);
        }
      }
      
      // Reset socket refs FIRST - this is critical to allow new connections
      currentSocketRef.current = null;
      hasCreatedSocketRef.current = false;
      currentPlayerRef.current = null;
      currentRoomRef.current = null;
      
      // Reset all state - do this after clearing refs and localStorage
      dispatch({ type: 'RESET_GAME' });
      dispatch({ type: 'SET_ROOM', payload: null });
      dispatch({ type: 'SET_PLAYER', payload: null });
      dispatch({ type: 'SET_SOCKET', payload: null });
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'CLEAR_ERROR' });
      
      // Navigate to home
      navigate('/');
      
      // Reset exit flag after a short delay to allow navigation
      setTimeout(() => {
        isExitingRef.current = false;
      }, 1000);
    }
  };

  return (
    <GameContext.Provider value={{ ...state, ...actions, state }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 