import { GameBoard, GameState, Player, Position, Score } from './types';

export function createEmptyBoard(size: number = 8): GameBoard {
  return Array(size).fill(null).map(() => Array(size).fill(null));
}

export function calculateScore(board: GameBoard): Score {
  return board.flat().reduce(
    (acc, cell) => ({
      player1: acc.player1 + (cell === 1 ? 1 : 0),
      player2: acc.player2 + (cell === 2 ? 1 : 0),
    }),
    { player1: 0, player2: 0 }
  );
}

export function hasValidMoves(board: GameBoard, player: Player): boolean {
  const totalMoves = board.flat().filter(cell => cell !== null).length;
  
  // For first two moves, check if there are any empty spaces
  if (totalMoves < 2) {
    return board.flat().some(cell => cell === null);
  }

  // Check each empty cell for valid moves
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] === null && isAdjacentToTerritory({ x, y }, board, player)) {
        return true;
      }
    }
  }
  return false;
}

export function determineWinner(score: Score): Player | null {
  if (score.player1 === score.player2) return null;
  return score.player1 > score.player2 ? 1 : 2;
}

export function isValidMove(position: Position, board: GameBoard, player: Player): boolean {
  const { x, y } = position;
  const totalMoves = board.flat().filter(cell => cell !== null).length;
  
  // Check if position is within bounds
  if (x < 0 || x >= board.length || y < 0 || y >= board.length) {
    return false;
  }

  // Check if cell is already taken
  if (board[y][x] !== null) {
    return false;
  }

  // First two moves can be placed anywhere
  if (totalMoves < 2) {
    return true;
  }

  // After first two moves, must be adjacent to own territory
  return isAdjacentToTerritory(position, board, player);
}

export function calculateStateHash(gameState: GameState): string {
  const boardString = gameState.board.flat().map(cell => cell || '0').join('');
  const playerString = gameState.currentPlayer.toString();
  const movesString = gameState.moveHistory
    .map(move => `${move.x},${move.y}`)
    .join(';');
  
  return btoa(`${boardString}-${playerString}-${movesString}`);
}

export function isAdjacentToTerritory(position: Position, board: GameBoard, player: Player): boolean {
  const { x, y } = position;
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  
  return directions.some(([dx, dy]) => {
    const newX = x + dx;
    const newY = y + dy;
    return (
      newX >= 0 && 
      newX < board.length && 
      newY >= 0 && 
      newY < board.length && 
      board[newY][newX] === player
    );
  });
}