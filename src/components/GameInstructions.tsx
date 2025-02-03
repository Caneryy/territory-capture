import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

export function GameInstructions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <HelpCircle size={16} /> Rules
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mb-4">How to Play</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Objective</h3>
                <p className="text-gray-600">
                  Capture more territory than your opponent by placing pieces strategically on the board.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Rules</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Players take turns placing their pieces on empty cells</li>
                  <li>The first two moves can be placed anywhere on the board</li>
                  <li>After the first two moves, new pieces must be placed adjacent to your existing pieces</li>
                  <li>The game ends when neither player can make a valid move</li>
                  <li>The player with the most territory wins!</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Tips</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Plan your first two moves carefully - they determine where you can expand</li>
                  <li>Try to block your opponent's expansion while growing your territory</li>
                  <li>Watch for opportunities to cut off your opponent's paths</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 