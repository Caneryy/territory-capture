export type Player = 1 | 2;
export type CellState = Player | null;
export type GameBoard = CellState[][];
export type Position = { x: number; y: number };

export interface Score {
  player1: number;
  player2: number;
}

export interface GameState {
  board: GameBoard;
  currentPlayer: Player;
  moveHistory: Position[];
  stateHash: string;
  score: Score;
  hoveredCell: Position | null;
  isGameOver: boolean;
  winner: Player | null;
  startTime: number;
  undoStack: GameState[];
  redoStack: GameState[];
}

export interface GameContextType {
  gameState: GameState;
  makeMove: (position: Position) => void;
  verifyState: () => string;
  resetGame: () => void;
  loadState: (state: GameState) => void;
  setHoveredCell: (position: Position | null) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}