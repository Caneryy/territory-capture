import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../GameContext';
import { Position } from '../types';
import { isValidMove, isAdjacentToTerritory } from '../utils';
import { soundEffects } from '../utils/sounds';

export function GameBoard() {
  const { gameState, makeMove, setHoveredCell } = useGame();
  const { board, currentPlayer, hoveredCell, isGameOver, winner } = gameState;
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (winner) {
      soundEffects.play('win');
    }
  }, [winner]);

  const handleCellClick = (position: Position) => {
    if (isValidMove(position, board, currentPlayer)) {
      soundEffects.play('place');
      makeMove(position);
    } else {
      soundEffects.play('invalid');
    }
  };

  const handleCellHover = (position: Position) => {
    if (!isGameOver) {
      setHoveredCell(position);
    }
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isGameOver) return;

    const current = selectedCell || { x: 0, y: 0 };
    let newPosition: Position | null = null;

    switch (e.key) {
      case 'ArrowUp':
        newPosition = { x: current.x, y: Math.max(0, current.y - 1) };
        break;
      case 'ArrowDown':
        newPosition = { x: current.x, y: Math.min(7, current.y + 1) };
        break;
      case 'ArrowLeft':
        newPosition = { x: Math.max(0, current.x - 1), y: current.y };
        break;
      case 'ArrowRight':
        newPosition = { x: Math.min(9, current.x + 1), y: current.y };
        break;
      case 'Enter':
      case ' ':
        if (selectedCell) {
          handleCellClick(selectedCell);
        }
        e.preventDefault();
        break;
      default:
        return;
    }

    if (newPosition) {
      e.preventDefault();
      setSelectedCell(newPosition);
      handleCellHover(newPosition);
    }
  };

  const getCellClassName = (x: number, y: number, cell: number | null) => {
    const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
    const isSelected = selectedCell?.x === x && selectedCell?.y === y;
    const isValid = !isGameOver && cell === null && isValidMove({ x, y }, board, currentPlayer);
    const isAdjacent = !isGameOver && cell === null && isAdjacentToTerritory({ x, y }, board, currentPlayer);

    return `
      w-12 h-12 rounded-md transition-all duration-200 transform
      ${cell === null ? 'bg-white dark:bg-gray-700' : ''}
      ${cell === 1 ? 'bg-blue-500 shadow-lg scale-105' : ''}
      ${cell === 2 ? 'bg-red-500 shadow-lg scale-105' : ''}
      ${isHovered && isValid ? `bg-${currentPlayer === 1 ? 'blue' : 'red'}-200 scale-110 shadow-md` : ''}
      ${!isHovered && isAdjacent ? `hover:bg-${currentPlayer === 1 ? 'blue' : 'red'}-100 hover:scale-105 hover:shadow-sm` : ''}
      ${(cell === null && !isValid) || isGameOver ? 'cursor-not-allowed opacity-50' : ''}
      ${isValid ? 'cursor-pointer hover:scale-105' : ''}
      ${isSelected ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''}
      relative
    `;
  };

  const getCellContent = (x: number, y: number, cell: number | null) => {
    const isValid = !isGameOver && cell === null && isValidMove({ x, y }, board, currentPlayer);

    if (cell !== null) {
      return (
        <div className={`
          absolute inset-2 rounded-sm
          ${cell === 1 ? 'bg-blue-600' : 'bg-red-600'}
          transform transition-transform duration-300 ease-out
          ${cell === currentPlayer ? 'scale-100' : 'scale-95'}
        `} />
      );
    }

    if (isValid && !isGameOver) {
      return (
        <div className={`
          absolute inset-2 rounded-sm opacity-20
          ${currentPlayer === 1 ? 'bg-blue-500' : 'bg-red-500'}
          transform transition-all duration-200
          scale-0 group-hover:scale-90
        `} />
      );
    }

    return null;
  };

  return (
    <div 
      ref={boardRef}
      className="grid grid-cols-8 gap-1 bg-gray-200 dark:bg-gray-600 p-2 rounded-xl shadow-lg"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="grid"
      aria-label="Game Board"
    >
      {board.map((row, y) =>
        row.map((cell, x) => (
          <button
            key={`${x}-${y}`}
            onClick={() => handleCellClick({ x, y })}
            onMouseEnter={() => handleCellHover({ x, y })}
            onMouseLeave={handleCellLeave}
            onFocus={() => setSelectedCell({ x, y })}
            className={`group ${getCellClassName(x, y, cell)}`}
            disabled={cell !== null || !isValidMove({ x, y }, board, currentPlayer) || isGameOver}
            role="gridcell"
            aria-label={`Cell ${x + 1},${y + 1}${cell ? ` - Player ${cell}` : ''}`}
          >
            {getCellContent(x, y, cell)}
          </button>
        ))
      )}
    </div>
  );
}