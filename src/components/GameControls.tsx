import React, { useState, useEffect } from 'react';
import { Copy, RotateCcw, Upload, Volume2, VolumeX, Undo2, Redo2 } from 'lucide-react';
import { useGame } from '../GameContext';
import { GameInstructions } from './GameInstructions';
import { MoveHistory } from './MoveHistory';
import { soundEffects } from '../utils/sounds';

export function GameControls() {
  const { gameState, verifyState, resetGame, loadState, undo, redo, canUndo, canRedo } = useGame();
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    soundEffects.init();
  }, []);

  const handleCopyState = () => {
    const stateString = JSON.stringify(gameState);
    navigator.clipboard.writeText(stateString);
  };

  const handleLoadState = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const state = JSON.parse(text);
      loadState(state);
    } catch (error) {
      console.error('Invalid game state');
    }
  };

  const toggleSound = () => {
    const enabled = soundEffects.toggle();
    setSoundEnabled(enabled);
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex justify-center gap-4">
        <GameInstructions />
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          {soundEnabled ? 'Sound On' : 'Sound Off'}
        </button>
      </div>
      <div className="flex gap-4 justify-center flex-wrap">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
            ${canUndo 
              ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
            }`}
        >
          <Undo2 size={16} /> Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
            ${canRedo 
              ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
            }`}
        >
          <Redo2 size={16} /> Redo
        </button>
        <button
          onClick={handleCopyState}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Copy size={16} /> Copy State
        </button>
        <button
          onClick={handleLoadState}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          <Upload size={16} /> Load State
        </button>
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>
      <MoveHistory />
    </div>
  );
}