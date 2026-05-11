import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNames } from "../utils/NamesContext";
import "./TicTacToe.css";

const BOARD_SIZE = 9;
const TOP_PLAYER = { id: "top", name: "Top" };
const BOT_PLAYER = { id: "bot", name: "Bot" };
const SYMBOLS = ["X", "O"];
const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const SYMBOL_LABELS = {
  X: "Cross",
  O: "Circle",
};

function createEmptyBoard() {
  return Array(BOARD_SIZE).fill(null);
}

function getNextSymbol(symbol) {
  return symbol === "X" ? "O" : "X";
}

function getPlayerId(player) {
  return String(player.id);
}

function isExclusivePlayerId(playerId) {
  return playerId === getPlayerId(TOP_PLAYER) || playerId === getPlayerId(BOT_PLAYER);
}

function getGameResult(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        status: "won",
        symbol: board[a],
        line: [a, b, c],
      };
    }
  }

  if (board.every(Boolean)) {
    return { status: "draw", symbol: null, line: [] };
  }

  return { status: "playing", symbol: null, line: [] };
}

function getOpenCells(board) {
  return board
    .map((cell, index) => (cell ? null : index))
    .filter((index) => index !== null);
}

function findWinningMove(board, symbol) {
  for (const index of getOpenCells(board)) {
    const nextBoard = [...board];
    nextBoard[index] = symbol;
    if (getGameResult(nextBoard).symbol === symbol) {
      return index;
    }
  }

  return null;
}

function chooseBotMove(board, symbol) {
  const opponent = getNextSymbol(symbol);
  const winningMove = findWinningMove(board, symbol);
  if (winningMove !== null) return winningMove;

  const blockingMove = findWinningMove(board, opponent);
  if (blockingMove !== null) return blockingMove;

  if (!board[4]) return 4;

  const preferredCells = [0, 2, 6, 8, 1, 3, 5, 7];
  return preferredCells.find((index) => !board[index]) ?? null;
}

function getMemberNames(members) {
  return members.length ? members.map((member) => member.name).join(", ") : "No players selected";
}

export default function TicTacToe({ shockSelection = false }) {
  const navigate = useNavigate();
  const { names } = useNames();
  const boardAreaRef = useRef(null);
  const [assignments, setAssignments] = useState({});
  const [gameConfig, setGameConfig] = useState(null);
  const [board, setBoard] = useState(createEmptyBoard);
  const [currentSymbol, setCurrentSymbol] = useState("X");
  const [boardLayout, setBoardLayout] = useState({
    size: 240,
    gap: 8,
    padding: 10,
    fontSize: 64,
  });

  const availablePlayers = useMemo(() => {
    const activePlayers = names.filter((name) => name.active);
    return [...activePlayers, TOP_PLAYER, BOT_PLAYER];
  }, [names]);

  const availableKey = useMemo(
    () => `${shockSelection ? "multi" : "single"}:${availablePlayers.map(getPlayerId).join(",")}`,
    [availablePlayers, shockSelection]
  );

  useEffect(() => {
    const availableIds = new Set(availablePlayers.map(getPlayerId));

    setAssignments((current) => {
      const nextAssignments = {};
      Object.entries(current).forEach(([playerId, symbol]) => {
        if (availableIds.has(playerId)) {
          nextAssignments[playerId] = symbol;
        }
      });
      return nextAssignments;
    });

    setGameConfig(null);
    setBoard(createEmptyBoard());
    setCurrentSymbol("X");
  }, [availableKey, availablePlayers]);

  const setupPreview = useMemo(() => {
    const getAssignedPlayers = (symbol) =>
      availablePlayers.filter((player) => assignments[getPlayerId(player)] === symbol);
    const teams = {
      X: getAssignedPlayers("X"),
      O: getAssignedPlayers("O"),
    };

    return {
      bots: {
        X: teams.X.some((player) => getPlayerId(player) === getPlayerId(BOT_PLAYER)),
        O: teams.O.some((player) => getPlayerId(player) === getPlayerId(BOT_PLAYER)),
      },
      teams,
    };
  }, [assignments, availablePlayers]);

  const setupError = useMemo(() => {
    if (!setupPreview.teams.X.length) {
      return "Cross Team needs a player or bot.";
    }

    if (!setupPreview.teams.O.length) {
      return "Circle Team needs a player or bot.";
    }

    return "";
  }, [setupPreview]);

  const activeConfig = gameConfig ?? setupPreview;
  const teams = activeConfig.teams;
  const botTeams = activeConfig.bots;
  const gameResult = useMemo(() => getGameResult(board), [board]);
  const gameStarted = Boolean(gameConfig);
  const isBotTurn = gameStarted && botTeams[currentSymbol] && gameResult.status === "playing";
  const winnerTeam = gameResult.symbol ? teams[gameResult.symbol] : [];
  const loserSymbol = gameResult.symbol ? getNextSymbol(gameResult.symbol) : null;
  const loserTeam = loserSymbol ? teams[loserSymbol] : [];

  useLayoutEffect(() => {
    if (!gameStarted || !boardAreaRef.current) return;

    const boardArea = boardAreaRef.current;

    const updateBoardLayout = () => {
      const { width, height } = boardArea.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;

      const shortestSide = Math.min(width, height);
      const size = Math.max(1, Math.floor(shortestSide));
      const gap = Math.max(3, Math.min(10, Math.round(size * 0.025)));
      const padding = Math.max(6, Math.min(12, Math.round(size * 0.035)));
      const cellSize = Math.max(1, Math.floor((size - padding * 2 - gap * 2) / 3));
      const fontSize = Math.max(8, Math.round(cellSize * 0.62));

      setBoardLayout((current) => {
        if (
          current.size === size &&
          current.gap === gap &&
          current.padding === padding &&
          current.fontSize === fontSize
        ) {
          return current;
        }

        return { size, gap, padding, fontSize };
      });
    };

    updateBoardLayout();

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateBoardLayout) : null;
    resizeObserver?.observe(boardArea);
    window.addEventListener("resize", updateBoardLayout);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateBoardLayout);
    };
  }, [gameStarted]);

  useEffect(() => {
    if (!isBotTurn) return;

    const botSymbol = currentSymbol;
    const timeoutId = window.setTimeout(() => {
      setBoard((currentBoard) => {
        if (getGameResult(currentBoard).status !== "playing") {
          return currentBoard;
        }

        const move = chooseBotMove(currentBoard, botSymbol);
        if (move === null) return currentBoard;

        const nextBoard = [...currentBoard];
        nextBoard[move] = botSymbol;
        if (getGameResult(nextBoard).status === "playing") {
          setCurrentSymbol(getNextSymbol(botSymbol));
        }
        return nextBoard;
      });
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [currentSymbol, isBotTurn]);

  const assignPlayer = (playerId, symbol) => {
    setAssignments((current) => {
      const nextAssignments = { ...current };

      if (!symbol) {
        nextAssignments[playerId] = null;
        return nextAssignments;
      }

      Object.entries(nextAssignments).forEach(([assignedPlayerId, assignedSymbol]) => {
        const selectedPlayerIsExclusive = isExclusivePlayerId(playerId);
        const assignedPlayerIsExclusive = isExclusivePlayerId(assignedPlayerId);
        const sameTeam = assignedSymbol === symbol;

        if (sameTeam && (selectedPlayerIsExclusive || assignedPlayerIsExclusive)) {
          nextAssignments[assignedPlayerId] = null;
        }
      });

      nextAssignments[playerId] = symbol;
      return nextAssignments;
    });
  };

  const startGame = () => {
    if (setupError) return;
    setGameConfig(setupPreview);
    setBoard(createEmptyBoard());
    setCurrentSymbol("X");
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentSymbol("X");
  };

  const returnToSetup = () => {
    setGameConfig(null);
    setBoard(createEmptyBoard());
    setCurrentSymbol("X");
  };

  const handleCellClick = (index) => {
    if (
      !gameStarted ||
      isBotTurn ||
      board[index] ||
      gameResult.status !== "playing"
    ) {
      return;
    }

    const nextBoard = [...board];
    nextBoard[index] = currentSymbol;
    setBoard(nextBoard);

    if (getGameResult(nextBoard).status === "playing") {
      setCurrentSymbol(getNextSymbol(currentSymbol));
    }
  };

  const statusText = (() => {
    if (!gameStarted) return setupError || "Ready to start.";
    if (gameResult.status === "draw") return "Draw. No team won or lost.";
    if (gameResult.status === "won") {
      return `${SYMBOL_LABELS[gameResult.symbol]} Team won. ${SYMBOL_LABELS[loserSymbol]} Team lost.`;
    }
    return `${SYMBOL_LABELS[currentSymbol]} Team to move`;
  })();

  const renderHeader = () => (
    <header className="tictactoe-header">
      <h1>TicTacToe</h1>
      <span className="mode-pill">{shockSelection ? "Multi Mode" : "Single Mode"}</span>
    </header>
  );

  const renderTeamPanel = () => (
    <section className="team-panel" aria-label="Teams">
      {SYMBOLS.map((symbol) => (
        <article
          key={symbol}
          className={`team-card ${
            gameStarted && currentSymbol === symbol && gameResult.status === "playing" ? "active" : ""
          }`}
        >
          <div className="team-symbol">{symbol}</div>
          <div className="team-details">
            <h2>{SYMBOL_LABELS[symbol]} Team</h2>
            <p>{getMemberNames(teams[symbol])}</p>
          </div>
        </article>
      ))}
    </section>
  );

  const renderAssignmentButtons = (player) => {
    const playerId = getPlayerId(player);
    const assignedSymbol = assignments[playerId] ?? null;

    return (
      <div className="assignment-buttons">
        <button
          className={!assignedSymbol ? "selected" : ""}
          onClick={() => assignPlayer(playerId, null)}
        >
          None
        </button>
        {SYMBOLS.map((symbol) => (
          <button
            key={symbol}
            className={assignedSymbol === symbol ? "selected" : ""}
            onClick={() => assignPlayer(playerId, symbol)}
          >
            {symbol}
          </button>
        ))}
      </div>
    );
  };

  if (!gameStarted) {
    return (
      <div className="tictactoe-page setup-open">
        {renderHeader()}

        <section className="setup-panel">
          <div className="setup-heading">
            <h2>Team Selection</h2>
            <p>Assign players, Top, or Bot to a team. Top and Bot play alone.</p>
          </div>

          <div className="player-assignment-list">
            {availablePlayers.map((player) => (
              <div key={getPlayerId(player)} className="player-assignment-row">
                <span className="player-name">{player.name}</span>
                {renderAssignmentButtons(player)}
              </div>
            ))}
          </div>

          {renderTeamPanel()}

          <section className={`game-status ${setupError ? "warning" : ""}`} aria-live="polite">
            <span>{statusText}</span>
          </section>

          <div className="tictactoe-actions">
            <button onClick={startGame} className="tictactoe-action" disabled={Boolean(setupError)}>
              Start
            </button>
            <button onClick={() => navigate("/")} className="tictactoe-action secondary">
              Back
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="tictactoe-page game-open">
      {renderHeader()}
      {renderTeamPanel()}

      <section className="game-status" aria-live="polite">
        <span>{statusText}</span>
        {gameResult.status === "won" && (
          <div className="result-breakdown">
            <span>Winner: {getMemberNames(winnerTeam)}</span>
            <span>Loser: {getMemberNames(loserTeam)}</span>
          </div>
        )}
      </section>

      <div className="tictactoe-board-area" ref={boardAreaRef}>
        <div
          className="tictactoe-board"
          aria-label="TicTacToe board"
          style={{
            "--tictactoe-board-size": `${boardLayout.size}px`,
            "--tictactoe-board-gap": `${boardLayout.gap}px`,
            "--tictactoe-board-padding": `${boardLayout.padding}px`,
            "--tictactoe-cell-font-size": `${boardLayout.fontSize}px`,
          }}
        >
          {board.map((cell, index) => (
            <button
              key={index}
              className={`tictactoe-cell ${cell ? "filled" : ""} ${
                gameResult.line.includes(index) ? "winning" : ""
              }`}
              onClick={() => handleCellClick(index)}
              disabled={!gameStarted || isBotTurn || Boolean(cell) || gameResult.status !== "playing"}
              aria-label={`Cell ${index + 1}${cell ? `, ${SYMBOL_LABELS[cell]}` : ""}`}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>

      <div className="tictactoe-actions">
        <button onClick={resetGame} className="tictactoe-action">
          New
        </button>
        <button onClick={returnToSetup} className="tictactoe-action secondary">
          Teams
        </button>
        <button onClick={() => navigate("/")} className="tictactoe-action secondary">
          Back
        </button>
      </div>
    </div>
  );
}
