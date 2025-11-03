import { useState, useEffect } from 'react';
import { shock_person } from '../shock_modes';

const CELL_STATES = {
  HIDDEN: 'hidden',
  REVEALED: 'revealed',
  FLAGGED: 'flagged'
};

function Minesweeper({ players, gameSettings, onGameEnd, collars }) {
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const [flagsRemaining, setFlagsRemaining] = useState(gameSettings.mines || 10);
  
  const rows = gameSettings.rows || 10;
  const cols = gameSettings.cols || 10;
  const mines = gameSettings.mines || 10;

  // Initialize board
  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        isMine: false,
        state: CELL_STATES.HIDDEN,
        adjacentMines: 0
      }))
    );
    setBoard(newBoard);
    setGameOver(false);
    setGameWon(false);
    setCurrentPlayerIndex(0);
    setFirstClick(true);
    setFlagsRemaining(mines);
  };

  const placeMines = (firstClickRow, firstClickCol) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    let minesPlaced = 0;

    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      
      // Don't place mine on first click or adjacent cells
      if (newBoard[row][col].isMine || 
          (Math.abs(row - firstClickRow) <= 1 && Math.abs(col - firstClickCol) <= 1)) {
        continue;
      }

      newBoard[row][col].isMine = true;
      minesPlaced++;
    }

    // Calculate adjacent mines
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = row + dr;
              const nc = col + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          newBoard[row][col].adjacentMines = count;
        }
      }
    }

    return newBoard;
  };

  const revealCell = (row, col) => {
    if (gameOver || gameWon || board[row][col].state !== CELL_STATES.HIDDEN) {
      return;
    }

    const newBoard = board.map(r => r.map(c => ({ ...c })));

    // Place mines after first click
    if (firstClick) {
      const boardWithMines = placeMines(row, col);
      newBoard.forEach((r, ri) => {
        r.forEach((c, ci) => {
          newBoard[ri][ci] = boardWithMines[ri][ci];
        });
      });
      setFirstClick(false);
    }

    // Reveal the cell
    if (newBoard[row][col].isMine) {
      // Game over - current player loses
      // Reveal all mines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].state = CELL_STATES.REVEALED;
          }
        }
      }
      newBoard[row][col].state = CELL_STATES.REVEALED;
      setBoard(newBoard);
      setGameOver(true);
      handleLose();
      return;
    }

    // Reveal cell and adjacent cells if it's a zero
    const reveal = (r, c) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols || 
          newBoard[r][c].state === CELL_STATES.REVEALED || 
          newBoard[r][c].state === CELL_STATES.FLAGGED) {
        return;
      }

      newBoard[r][c].state = CELL_STATES.REVEALED;

      if (newBoard[r][c].adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            reveal(r + dr, c + dc);
          }
        }
      }
    };

    reveal(row, col);
    setBoard(newBoard);

    // Check if game is won
    checkWin(newBoard);

    // Move to next player
    nextPlayer();
  };

  const toggleFlag = (row, col, e) => {
    e.preventDefault();
    if (gameOver || gameWon || board[row][col].state === CELL_STATES.REVEALED) {
      return;
    }

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    if (newBoard[row][col].state === CELL_STATES.FLAGGED) {
      newBoard[row][col].state = CELL_STATES.HIDDEN;
      setFlagsRemaining(flagsRemaining + 1);
    } else {
      newBoard[row][col].state = CELL_STATES.FLAGGED;
      setFlagsRemaining(flagsRemaining - 1);
    }
    setBoard(newBoard);
  };

  const checkWin = (currentBoard) => {
    let revealedCount = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (currentBoard[row][col].state === CELL_STATES.REVEALED && !currentBoard[row][col].isMine) {
          revealedCount++;
        }
      }
    }
    if (revealedCount === rows * cols - mines) {
      setGameWon(true);
      onGameEnd(null); // No loser if game is won
    }
  };

  const nextPlayer = () => {
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  const handleLose = () => {
    const losingPlayer = players[currentPlayerIndex];
    const losingCollar = collars.find(c => c.name === losingPlayer);
    
    if (losingCollar) {
      shock_person(losingCollar, gameSettings.strength, gameSettings.duration);
    }
    
    onGameEnd(losingPlayer);
  };

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Minesweeper</h2>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>
          <strong>Current Player: {currentPlayer}</strong>
        </div>
        <div style={{ fontSize: '16px', marginBottom: '10px' }}>
          Flags remaining: {flagsRemaining}
        </div>
        {gameOver && (
          <div style={{ color: 'red', fontSize: '20px', fontWeight: 'bold', marginTop: '10px' }}>
            Game Over! {currentPlayer} hit a mine!
          </div>
        )}
        {gameWon && (
          <div style={{ color: 'green', fontSize: '20px', fontWeight: 'bold', marginTop: '10px' }}>
            Game Won! All players survived!
          </div>
        )}
        <button 
          onClick={initializeBoard}
          style={{ 
            marginTop: '10px', 
            padding: '10px 20px', 
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Reset Game
        </button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${cols}, 30px)`,
        gap: '2px',
        justifyContent: 'center',
        backgroundColor: '#bbb',
        padding: '10px',
        borderRadius: '5px'
      }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => revealCell(rowIndex, colIndex)}
              onContextMenu={(e) => toggleFlag(rowIndex, colIndex, e)}
              disabled={gameOver || gameWon}
              style={{
                width: '30px',
                height: '30px',
                border: '1px solid #999',
                backgroundColor: cell.state === CELL_STATES.REVEALED 
                  ? (cell.isMine ? '#f00' : '#ddd')
                  : cell.state === CELL_STATES.FLAGGED 
                  ? '#ff0'
                  : '#bbb',
                cursor: gameOver || gameWon ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {cell.state === CELL_STATES.REVEALED && cell.isMine && '💣'}
              {cell.state === CELL_STATES.REVEALED && !cell.isMine && cell.adjacentMines > 0 && cell.adjacentMines}
              {cell.state === CELL_STATES.FLAGGED && '🚩'}
            </button>
          ))
        )}
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center' }}>
        <p>Left click to reveal • Right click to flag</p>
      </div>
    </div>
  );
}

export default Minesweeper;

