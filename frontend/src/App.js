import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import Replay from './Replay';
import axios from 'axios';

export default function App() {
  const [boardSize, setBoardSize] = useState(3);
  const [history, setHistory] = useState([]);
  const [replayGame, setReplayGame] = useState(null);
  const [error, setError] = useState(''); 

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await axios.get('http://localhost:5000/api/game/history');
    setHistory(res.data);
  };

  const clearHistory = async () => {
    if (window.confirm('คุณต้องการล้างประวัติการเล่นทั้งหมดหรือไม่?')) {
      await axios.delete('http://localhost:5000/api/game/history');
      fetchHistory();
    }
  };


  const handleBoardSizeChange = (value) => {
    const size = Number(value);
    if (value === '') {
      setBoardSize('');
      setError('');
    } else if (size > 15) {
      setError('Maximum size is 15 เพราะว่ามันจะใหญ่เกินไปและทำให้โปรแกรมทำงานช้าลง');
    } else {
      setBoardSize(size);
      setError('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
      padding: 40,
      fontFamily: 'Segoe UI, Arial, sans-serif',
      position: 'relative'
    }}>
      <div style={{
        width: `min(95vw, ${Math.max(400, boardSize * 80)}px)`,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 6px 28px rgba(0,0,0,0.1)',
        padding: 32,
        transition: 'width 0.3s ease'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#ff0000ff',
          marginBottom: 24,
          fontWeight: 'bold'
        }}>
          XO Game 
        </h1>

        {!replayGame ? (
          <>
            <div style={{
              marginBottom: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              width: '100%'
            }}>
              <input
                type="number"
                min={3}
                max={15}
                value={boardSize}
                onChange={(e) => handleBoardSizeChange(e.target.value)}
                style={{
                  width: 100,
                  padding: 6,
                  borderRadius: 6,
                  border: error ? '2px solid #ef4444' : '1px solid #c7d2fe',
                  fontSize: 16,
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
              <label style={{ fontWeight: 500, marginTop: 4 }}>
                Board Size
              </label>
              {/* ✅ แสดงเฉพาะการเตือนกรณีเกิน 15 */}
              {error && (
                <span style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                  {error}
                </span>
              )}
            </div>

            <GameBoard boardSize={boardSize || 3} onSave={fetchHistory} />

            <h2 style={{ marginTop: 32, color: '#6366f1' }}>History</h2>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={clearHistory}
                style={{
                  padding: '8px 16px',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                🗑 Clear History
              </button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0 }}>
              {history.length === 0 && (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                  ยังไม่มีประวัติการเล่น
                </p>
              )}
              {history.map(h => (
                <li key={h._id} style={{
                  background: '#f1f5f9',
                  marginBottom: 12,
                  borderRadius: 8,
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>
                    <b>{h.boardSize}x{h.boardSize}</b> - Winner:{' '}
                    <span style={{
                      color: h.winner ? '#22c55e' : '#64748b'
                    }}>
                      {h.winner || 'Draw'}
                    </span>
                  </span>
                  <button
                    onClick={() => setReplayGame(h)}
                    style={{
                      background: '#6366f1',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 16px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      transition: 'background 0.2s'
                    }}
                  >
                    Replay
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Replay game={replayGame} onBack={() => setReplayGame(null)} />
        )}
      </div>

      {/* ✅ Footer แสดงความเป็นเจ้าของ */}
      <div style={{
        position: 'fixed',
        bottom: 8,
        right: 12,
        fontSize: 12,
        color: '#9ca3af'
      }}>
        © XO Game by Panuwat L.
      </div>
    </div>
  );
}
