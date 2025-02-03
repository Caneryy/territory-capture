import React, { useState, useEffect } from 'react';
import { GameProvider } from './GameContext';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { GameStats } from './components/GameStats';
import { WinAnimation } from './components/WinAnimation';
import { useGame } from './GameContext';
import { Moon, Sun } from 'lucide-react';

function GameStatus() {
  const { gameState } = useGame();
  const { currentPlayer, score, stateHash, isGameOver, winner } = gameState;
  
  return (
    <div className="text-center mb-6">
      {isGameOver ? (
        <div className="text-2xl font-bold mb-2 dark:text-white">
          {winner ? `Player ${winner} Wins!` : "It's a Tie!"}
        </div>
      ) : (
        <div className="text-2xl font-bold mb-2 dark:text-white">
          Player {currentPlayer}'s Turn
        </div>
      )}
      <div className="flex justify-center gap-8 text-lg mb-2">
        <div className={`flex items-center gap-2 ${winner === 1 ? 'text-blue-600 dark:text-blue-400 font-bold' : 'dark:text-gray-300'}`}>
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Player 1: {score.player1}</span>
        </div>
        <div className={`flex items-center gap-2 ${winner === 2 ? 'text-red-600 dark:text-red-400 font-bold' : 'dark:text-gray-300'}`}>
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Player 2: {score.player2}</span>
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        State Hash: {stateHash.slice(0, 8)}...
      </div>
    </div>
  );
}

function GameContainer() {
  const { gameState } = useGame();
  const { isGameOver, winner } = gameState;

  return (
    <div className="flex flex-col items-center">
      <GameStatus />
      <GameStats />
      <GameBoard />
      <GameControls />
      {isGameOver && winner && <WinAnimation winner={winner} />}
    </div>
  );
}

function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-colors duration-200">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">
          Territory Capture
        </h1>
        <GameProvider>
          <GameContainer />
        </GameProvider>
      </div>
      <DarkModeToggle />
    </div>
  );
}

export default App;