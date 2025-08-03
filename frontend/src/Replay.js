import React, { useState, useEffect } from 'react';

export default function Replay({ game, onBack }) {
  const [step, setStep] = useState(0);

  // หา winLine จาก moves และ boardSize
  const getWinLine = () => {
    const board = Array(game.boardSize * game.boardSize).fill(null);
    game.moves.forEach(move => {
      const [player, pos] = move.split(':');
      const [r, c] = pos.split(',').map(Number);
      board[r * game.boardSize + c] = player;
    });

    const lines = [];
    for (let i = 0; i < game.boardSize; i++) {
      lines.push([...Array(game.boardSize).keys()].map(j => i * game.boardSize + j)); // row
      lines.push([...Array(game.boardSize).keys()].map(j => j * game.boardSize + i)); // col
    }
    lines.push([...Array(game.boardSize).keys()].map(i => i * (game.boardSize + 1))); // main diagonal
    lines.push([...Array(game.boardSize).keys()].map(i => (i + 1) * (game.boardSize - 1))); // anti-diagonal

    for (let line of lines) {
      const [a, ...rest] = line;
      if (board[a] && rest.every(i => board[i] === board[a])) return line;
    }
    return [];
  };

  const winLine = getWinLine();

  const currentBoard = () => {
    const b = Array(game.boardSize * game.boardSize).fill(null);
    game.moves.slice(0, step).forEach(move => {
      const [player, pos] = move.split(':');
      const [r, c] = pos.split(',').map(Number);
      b[r * game.boardSize + c] = player;
    });
    return b;
  };

  useEffect(() => {
    if (step < game.moves.length) {
      const timer = setTimeout(() => setStep(step + 1), 700);
      return () => clearTimeout(timer);
    }
  }, [step, game.moves.length]);

  const refreshReplay = () => {
    setStep(0);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Replay</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${game.boardSize}, 1fr)`,
          aspectRatio: '1 / 1',
          gap: '10px',
          margin: '24px auto',
          width: `min(90vw, ${Math.max(220, game.boardSize * 60)}px)`, 
          maxWidth: `${Math.max(220, game.boardSize * 60)}px`,         
          background: 'linear-gradient(120deg, #fdf6fd 60%, #e0e7ff 100%)',
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(99,102,241,0.10)',
          padding: 18,
        }}
      >
        {currentBoard().map((cell, i) => (
          <button
            key={i}
            style={{
              width: '100%',
              height: '100%',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              background: winLine.includes(i) && step === game.moves.length
                ? '#facc15'
                : cell === 'X'
                  ? '#ff0000ff'
                  : cell === 'O'
                    ? '#0088ffff'
                    : '#f1f5f9',
              color: cell ? '#fff' : '#64748b',
              border: winLine.includes(i) && step === game.moves.length ? '2px solid #eab308' : 'none',
              borderRadius: '12px',
              boxShadow: cell
                ? '0 2px 8px rgba(99,102,241,0.12)'
                : '0 1px 4px rgba(100,116,139,0.08)',
              cursor: 'default',
              transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
              outline: 'none'
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={refreshReplay}
          style={{
            marginRight: '10px',
            background: '#22d3ee',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          🔄 Replay Again
        </button>
        <button
          onClick={onBack}
          style={{
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
}
