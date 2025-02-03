import React from 'react';
import { useGame } from '../GameContext';
import { Trophy, Clock, Zap, BarChart2 } from 'lucide-react';

export function GameStats() {
  const { gameState } = useGame();
  const { moveHistory, score, currentPlayer, startTime } = gameState;

  const gameTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  const minutes = Math.floor(gameTime / 60);
  const seconds = gameTime % 60;

  const calculateTerritory = () => {
    const total = score.player1 + score.player2;
    if (total === 0) return { player1: 0, player2: 0 };
    return {
      player1: Math.round((score.player1 / total) * 100),
      player2: Math.round((score.player2 / total) * 100),
    };
  };

  const territory = calculateTerritory();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
          <Trophy size={16} />
          <span className="text-sm font-medium">Territory</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-red-500"
            style={{ width: `${territory.player1}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-sm">
          <span className="text-blue-600 dark:text-blue-400">{territory.player1}%</span>
          <span className="text-red-600 dark:text-red-400">{territory.player2}%</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
          <Clock size={16} />
          <span className="text-sm font-medium">Time</span>
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
          <Zap size={16} />
          <span className="text-sm font-medium">Moves</span>
        </div>
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {moveHistory.length}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-1">
          <BarChart2 size={16} />
          <span className="text-sm font-medium">Turn</span>
        </div>
        <div className={`text-2xl font-bold ${currentPlayer === 1 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
          Player {currentPlayer}
        </div>
      </div>
    </div>
  );
} 