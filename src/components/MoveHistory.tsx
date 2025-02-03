import React from 'react';
import { useGame } from '../GameContext';
import { History } from 'lucide-react';

export function MoveHistory() {
  const { gameState } = useGame();
  const { moveHistory } = gameState;

  if (moveHistory.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
      <div className="flex items-center gap-2 mb-3 text-gray-700 dark:text-gray-300">
        <History size={16} />
        <h3 className="font-semibold">Move History</h3>
      </div>
      <div className="max-h-32 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          {moveHistory.map((move, index) => (
            <div
              key={index}
              className={`
                text-sm p-2 rounded
                ${index % 2 === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'}
              `}
            >
              {`Player ${index % 2 + 1}: (${move.x + 1}, ${move.y + 1})`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 