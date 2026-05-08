import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useNames } from "../utils/NamesContext";
import "./Mindsweeper.css";
import { shock_person } from '../shock_modes';

const BOARD_SIZE = 9;
const MINE_COUNT = 10;

function createCell() {
  return {
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    neighborMines: 0,
  };
}

function initializeBoard(rows, cols, mines, excludeRow = -1, excludeCol = -1) {
  const board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, createCell)
  );

  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    const isExcludedCell =
      excludeRow >= 0 && excludeCol >= 0 &&
      Math.abs(row - excludeRow) <= 1 &&
      Math.abs(col - excludeCol) <= 1;

    if (!board[row][col].isMine && !isExcludedCell) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
              count++;
            }
          }
        }
        board[r][c].neighborMines = count;
      }
    }
  }

  return board;
}

function cloneBoard(board) {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

function revealArea(board, row, col) {
  const rows = board.length;
  const cols = board[0].length;
  const stack = [[row, col]];

  while (stack.length > 0) {
    const [r, c] = stack.pop();
    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    const cell = board[r][c];
    if (cell.isRevealed || cell.isFlagged) continue;

    cell.isRevealed = true;
    if (cell.neighborMines !== 0 || cell.isMine) continue;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        stack.push([r + dr, c + dc]);
      }
    }
  }
}

function revealAllMines(board) {
  board.forEach((row) =>
    row.forEach((cell) => {
      if (cell.isMine) {
        cell.isRevealed = true;
      }
    })
  );
}

function checkWin(board) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      const cell = board[r][c];
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
}

export default function Mindsweeper() {
  const { names } = useNames();
  const navigate = useNavigate();
  const [board, setBoard] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [message, setMessage] = useState('Click a cell to start.');
  const [isFlagMode, setIsFlagMode] = useState(false);
  const [firstClick, setFirstClick] = useState(true);

  useEffect(() => {
    // Initialize empty board
    setBoard(Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, createCell)
    ));
  }, []);

  const activeTargets = names.filter((n) => n.active && (n.game_mine ?? true));
  const shockTargets = activeTargets.length > 0 ? activeTargets : names.filter((n) => n.active);

  const handleCellClick = (row, col) => {
    if (gameStatus !== 'playing' || board.length === 0) return;

    const cell = board[row][col];
    if (cell.isRevealed) return;

    let nextBoard = cloneBoard(board);

    if (firstClick) {
      // Generate board with mines, avoiding the clicked cell
      nextBoard = initializeBoard(BOARD_SIZE, BOARD_SIZE, MINE_COUNT, row, col);
      setFirstClick(false);
    }

    const nextCell = nextBoard[row][col];

    if (isFlagMode) {
      // Toggle flag
      nextCell.isFlagged = !nextCell.isFlagged;
      setBoard(nextBoard);
      return;
    }

    if (cell.isFlagged) return;

    if (nextCell.isMine) {
      revealAllMines(nextBoard);
      setBoard(nextBoard);
      setGameStatus('lost');
      setMessage('Boom! You hit a mine.');
      shockTargets.forEach((target) => shock_person(target, 100, 800));
      return;
    }

    revealArea(nextBoard, row, col);
    setBoard(nextBoard);

    if (checkWin(nextBoard)) {
      setGameStatus('won');
      setMessage('Congratulations! You cleared the board.');
      return;
    }

    setMessage('Keep going...');
  };

  const handleCellRightClick = (e, row, col) => {
    e.preventDefault();
    if (gameStatus !== 'playing' || board.length === 0) return;

    const cell = board[row][col];
    if (cell.isRevealed) return;

    const nextBoard = cloneBoard(board);
    nextBoard[row][col].isFlagged = !nextBoard[row][col].isFlagged;
    setBoard(nextBoard);
  };

  const resetGame = () => {
    setBoard(Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, createCell)
    ));
    setGameStatus('playing');
    setMessage('Click a cell to start.');
    setIsFlagMode(false);
    setFirstClick(true);
  };

  const flaggedCount = board.flat().filter((cell) => cell.isFlagged).length;
  const minesRemaining = Math.max(0, MINE_COUNT - flaggedCount);

  return (
    <div className="mindsweeper-page">
      <div className="mindsweeper-header">
        <h1>Mindsweeper</h1>
      </div>

      <div className="mindsweeper-info">
        <span>Flags: {flaggedCount} / {MINE_COUNT}</span>
        <button onClick={() => setIsFlagMode(!isFlagMode)} className="btn-action mode-toggle">
          {isFlagMode ? '🚩 Flag Mode' : '💣 Reveal Mode'}
        </button>
      </div>

      <div className="board">
        {board.map((row, r) => (
          <div key={r} className="row">
            {row.map((cell, c) => {
              const classes = ['cell'];
              if (cell.isRevealed) classes.push('revealed');
              if (cell.isFlagged) classes.push('flagged');
              if (gameStatus !== 'playing' && cell.isMine) classes.push('mine');

              let content = '';
              if (cell.isFlagged) {
                content = '🚩';
              } else if (!cell.isRevealed) {
                content = '';
              } else if (cell.isMine) {
                content = '💣';
              } else if (cell.neighborMines > 0) {
                content = cell.neighborMines;
              }

              return (
                <button
                  key={c}
                  className={classes.join(' ')}
                  onClick={() => handleCellClick(r, c)}
                  onContextMenu={(e) => handleCellRightClick(e, r, c)}
                >
                  {content}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {gameStatus !== 'playing' && (
        <div className="mindsweeper-result">
          {gameStatus === 'won' ? 'You won! 🎉' : 'You lost. 💥'}
        </div>
      )}

      <div className="mindsweeper-actions">
        <button onClick={resetGame} className="btn-action">New Game</button>
        <button onClick={() => navigate('/')} className="btn-action btn-back">Back to Shock</button>
      </div>
    </div>
  );
}
