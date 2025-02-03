import React, { createContext, useContext, useState } from 'react';
import { GameContextType, GameState, Position, Player } from './types';
import { calculateStateHash, createEmptyBoard, isValidMove, calculateScore, hasValidMoves, determineWinner } from './utils';

const initialState: GameState = {
  board: createEmptyBoard(),
  currentPlayer: 1,
  moveHistory: [],
  stateHash: '',
  score: { player1: 0, player2: 0 },
  hoveredCell: null,
  isGameOver: false,
  winner: null,
  startTime: Date.now(),
  undoStack: [],
  redoStack: [],
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    ...initialState,
    stateHash: calculateStateHash(initialState),
  });

  const makeMove = (position: Position) => {
    if (!isValidMove(position, gameState.board, gameState.currentPlayer) || gameState.isGameOver) {
      return;
    }

    const newBoard = gameState.board.map(row => [...row]);
    newBoard[position.y][position.x] = gameState.currentPlayer;
    const newScore = calculateScore(newBoard);
    const nextPlayer = gameState.currentPlayer === 1 ? 2 : 1;

    // Check if either player has valid moves
    const hasNextPlayerMoves = hasValidMoves(newBoard, nextPlayer);
    const hasCurrentPlayerMoves = hasValidMoves(newBoard, gameState.currentPlayer);
    
    // Determine game over and winner
    const isGameOver = !hasNextPlayerMoves || !hasCurrentPlayerMoves;
    let winner: Player | null = null;
    
    if (isGameOver) {
      if (!hasNextPlayerMoves && hasCurrentPlayerMoves) {
        winner = gameState.currentPlayer;
      } else if (!hasCurrentPlayerMoves && hasNextPlayerMoves) {
        winner = nextPlayer;
      } else {
        winner = determineWinner(newScore);
      }
    }

    // Save current state to undo stack before updating
    const newUndoStack = [...gameState.undoStack, { ...gameState }];

    const newState: GameState = {
      board: newBoard,
      currentPlayer: nextPlayer,
      moveHistory: [...gameState.moveHistory, position],
      score: newScore,
      hoveredCell: null,
      isGameOver,
      winner,
      stateHash: '',
      startTime: gameState.startTime,
      undoStack: newUndoStack,
      redoStack: [], // Clear redo stack on new move
    };

    newState.stateHash = calculateStateHash(newState);
    setGameState(newState);
  };

  const verifyState = () => {
    return gameState.stateHash;
  };

  const resetGame = () => {
    const newState = {
      ...initialState,
      startTime: Date.now(),
      stateHash: calculateStateHash(initialState),
    };
    setGameState(newState);
  };

  const loadState = (state: GameState) => {
    const newHash = calculateStateHash(state);
    if (newHash === state.stateHash) {
      setGameState(state);
    }
  };

  const setHoveredCell = (position: Position | null) => {
    setGameState(prev => ({ ...prev, hoveredCell: position }));
  };

  const undo = () => {
    if (gameState.undoStack.length === 0) return;

    const newUndoStack = [...gameState.undoStack];
    const previousState = newUndoStack.pop()!;
    
    setGameState({
      ...previousState,
      undoStack: newUndoStack,
      redoStack: [...gameState.redoStack, { ...gameState }],
    });
  };

  const redo = () => {
    if (gameState.redoStack.length === 0) return;

    const newRedoStack = [...gameState.redoStack];
    const nextState = newRedoStack.pop()!;

    setGameState({
      ...nextState,
      undoStack: [...gameState.undoStack, { ...gameState }],
      redoStack: newRedoStack,
    });
  };

  const canUndo = gameState.undoStack.length > 0;
  const canRedo = gameState.redoStack.length > 0;

  return (
    <GameContext.Provider value={{ 
      gameState, 
      makeMove, 
      verifyState, 
      resetGame, 
      loadState,
      setHoveredCell,
      undo,
      redo,
      canUndo,
      canRedo
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}