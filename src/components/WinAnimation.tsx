import React, { useEffect, useState } from 'react';
import { Player } from '../types';

interface WinAnimationProps {
  winner: Player;
}

export function WinAnimation({ winner }: WinAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; angle: number; speed: number }>>([]);

  useEffect(() => {
    // Create confetti particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20,
      angle: (Math.random() * 60 - 30) * Math.PI / 180,
      speed: 3 + Math.random() * 2,
    }));
    setParticles(newParticles);

    // Cleanup
    return () => setParticles([]);
  }, [winner]);

  useEffect(() => {
    if (particles.length === 0) return;

    const animationFrame = requestAnimationFrame(() => {
      setParticles(prevParticles =>
        prevParticles
          .map(particle => ({
            ...particle,
            y: particle.y + particle.speed,
            x: particle.x + Math.sin(particle.angle) * particle.speed,
          }))
          .filter(particle => particle.y < window.innerHeight)
      );
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute w-2 h-2 rounded-full transform rotate-45
            ${winner === 1 ? 'bg-blue-500' : 'bg-red-500'}`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            opacity: 1 - (particle.y / window.innerHeight),
          }}
        />
      ))}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className={`text-6xl font-bold animate-bounce
          ${winner === 1 ? 'text-blue-500' : 'text-red-500'}`}>
          Player {winner} Wins!
        </div>
      </div>
    </div>
  );
} 