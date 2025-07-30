import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Single source for main colors, in case we refactor to CSS-in-JS
 */
const COLORS = {
  primary: '#1976d2',
  secondary: '#424242',
  accent: '#ffeb3b',
};

const EMPTY_BOARD = Array(9).fill(null);

// PUBLIC_INTERFACE
function App() {
  // X is player 1, O is player 2
  const [board, setBoard] = useState([...EMPTY_BOARD]);
  const [xIsNext, setXisNext] = useState(true);
  const [status, setStatus] = useState('');
  const [history, setHistory] = useState({
    X: 0,
    O: 0,
    draws: 0,
  });

  // Check for winner or draw after each move
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setStatus(`Winner: Player ${winner === 'X' ? '1 (X)' : '2 (O)'}`);
    } else if (board.every(cell => cell)) {
      setStatus("Draw");
    } else {
      setStatus(`Turn: Player ${xIsNext ? '1 (X)' : '2 (O)'}`);
    }
  }, [board, xIsNext]);

  // Update history when game ends
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner || board.every(cell => cell)) {
      setTimeout(() => {
        setHistory(prev => {
          if (winner) {
            return { ...prev, [winner]: prev[winner] + 1 };
          }
          if (board.every(cell => cell) && !winner) {
            return { ...prev, draws: prev.draws + 1 };
          }
          return prev;
        });
      }, 200);
    }
    // eslint-disable-next-line 
  }, [status]);

  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    if (board[idx] || calculateWinner(board)) return; // Prevent move if occupied or game over
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXisNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard([...EMPTY_BOARD]);
    setXisNext(true);
    setStatus('Turn: Player 1 (X)');
  }

  return (
    <div className="tic-tac-toe-app">
      <main className="main-container">
        <h1 className="title">Tic Tac Toe</h1>
        <div className="status" style={{ color: COLORS.primary }}>{status}</div>
        <div className="scoreboard">
          <span className="score x">Player 1 (X): <b>{history.X}</b></span>
          <span className="score o">Player 2 (O): <b>{history.O}</b></span>
          <span className="score draws">Draws: <b>{history.draws}</b></span>
        </div>
        <Board
          board={board}
          onCellClick={handleCellClick}
        />
        <button className="reset-btn" onClick={handleRestart}>
          Reset Game
        </button>
      </main>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * @param {Object} props
 * @param {Array} props.board - Array of 9 values: 'X', 'O', or null
 * @param {Function} props.onCellClick - Callback for cell click: idx => ()
 */
function Board({ board, onCellClick }) {
  return (
    <div className="board">
      {board.map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          onClick={() => onCellClick(idx)}
        />
      ))}
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * @param {Object} props
 * @param {string|null} props.value - 'X', 'O', or null
 * @param {Function} props.onClick
 */
function Cell({ value, onClick }) {
  return (
    <button className={`cell${value ? ' filled' : ''}`} onClick={onClick} aria-label={value ? value : 'empty'}>
      {value}
    </button>
  );
}

/**
 * Determine the winner of the board.
 * @param {Array} squares - the board array
 * @returns {'X'|'O'|null}
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
