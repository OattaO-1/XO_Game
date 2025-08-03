import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function GameBoard({ boardSize, onSave }) {
  const [board, setBoard] = useState(Array(boardSize * boardSize).fill(null));
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState([]);

  const [moves, setMoves] = useState([]);

  useEffect(() => {
    setBoard(Array(boardSize * boardSize).fill(null));
    setIsX(true);
    setWinner(null);
    setWinLine([]);
  }, [boardSize]);

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = isX ? 'X' : 'O';
    setBoard(newBoard);


    const newMoves = [...moves, `${isX ? 'X' : 'O'}:${Math.floor(i / boardSize)},${i % boardSize}`];
    setMoves(newMoves);

    setIsX(!isX);

    const winResult = checkWinner(newBoard);
    if (winResult) {
      setWinner(winResult.winner);
      setWinLine(winResult.line);
      saveGame(newMoves, winResult.winner); 
    } else if (!newBoard.includes(null)) {
      saveGame(newMoves, null); 
    }
  };

  const saveGame = async (moves, winner) => {
    await axios.post('http://localhost:5000/api/game/save', { boardSize, moves, winner });
    onSave();
  };

  const checkWinner = (b) => {
    const lines = [];
    for (let i = 0; i < boardSize; i++) {
      lines.push([...Array(boardSize).keys()].map(j => i * boardSize + j)); 
      lines.push([...Array(boardSize).keys()].map(j => j * boardSize + i)); 
    }
    lines.push([...Array(boardSize).keys()].map(i => i * (boardSize + 1))); 
    lines.push([...Array(boardSize).keys()].map(i => (i + 1) * (boardSize - 1))); 

    for (let line of lines) {
      const [a, ...rest] = line;
      if (b[a] && rest.every(i => b[i] === b[a])) return { winner: b[a], line };
    }
    return null;
  };

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
          aspectRatio: '1 / 1',
          gap: '8px',
          margin: '16px auto',
          width: `min(90vw, ${Math.max(220, boardSize * 70)}px)`, 
          maxWidth: `${Math.max(220, boardSize * 70)}px`,          
          background: '#f8fafc',
          borderRadius: 14,
          boxShadow: '0 2px 12px rgba(99,102,241,0.08)'
        }}
      >
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: '100%',
              height: '100%',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              background: winLine.includes(i)
                ? '#facc15' 
                : cell === 'X'
                  ? '#0088ffff'
                  : cell === 'O'
                    ? '#ff0000ff'
                    : '#f1f5f9',
              color: cell ? '#fff' : '#64748b',
              border: winLine.includes(i) ? '2px solid #eab308' : 'none', 
              borderRadius: '10px',
              cursor: cell || winner ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, box-shadow 0.2s, transform 0.15s',
              outline: 'none'
            }}
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && (
        <div style={{
          marginTop: 12,
          padding: '10px 0',
          background: '#e0e7ff',
          borderRadius: 10,
          textAlign: 'center',
          fontSize: 18,
          color: '#6366f1',
          fontWeight: 700,
          boxShadow: '0 2px 12px rgba(99,102,241,0.08)'
        }}>
          🎉 Winner: {winner || 'Draw'} 🎉
        </div>
      )}
    </div>
  );
}
