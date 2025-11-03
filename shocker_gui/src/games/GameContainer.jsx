import { useState } from 'react';
import Minesweeper from './Minesweeper';

function PlayerSelectionModal({ collars, onConfirm, onCancel }) {
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  const togglePlayer = (playerName) => {
    setSelectedPlayers(prev => 
      prev.includes(playerName)
        ? prev.filter(p => p !== playerName)
        : [...prev, playerName]
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      zIndex: 1000,
      minWidth: '400px',
      maxWidth: '500px',
      border: '2px solid #333'
    }}>
      <h3 style={{ 
        marginBottom: '20px', 
        fontSize: '24px', 
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'
      }}>
        Select Players
      </h3>
      {collars.length === 0 ? (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          color: '#666',
          marginBottom: '20px'
        }}>
          No collars available. Please add collars first.
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px', 
          marginBottom: '20px',
          maxHeight: '300px',
          overflowY: 'auto',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px'
        }}>
          {collars.map((collar) => (
            <label 
              key={collar.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px', 
                cursor: 'pointer',
                padding: '10px',
                backgroundColor: '#ffffff',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '16px'
              }}
            >
              <input
                type="checkbox"
                checked={selectedPlayers.includes(collar.name)}
                onChange={() => togglePlayer(collar.name)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ 
                color: '#000000',
                fontWeight: '500',
                flex: 1
              }}>
                {collar.name}
              </span>
            </label>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          onClick={() => onConfirm(selectedPlayers)}
          disabled={collars.length === 0 || selectedPlayers.length === 0}
          style={{
            padding: '12px 24px',
            backgroundColor: collars.length === 0 || selectedPlayers.length === 0 ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: collars.length === 0 || selectedPlayers.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '12px 24px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

const GAMES = {
  MINESWEEPER: 'minesweeper'
};

function GameContainer({ collars }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameSettings, setGameSettings] = useState({
    strength: 50,
    duration: 300,
    rows: 10,
    cols: 10,
    mines: 10
  });
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  const handleStartGame = (gameType) => {
    setShowPlayerSelection(true);
    setSelectedGame(gameType);
  };

  const handlePlayerSelection = (selectedPlayers) => {
    if (selectedPlayers.length === 0) {
      alert('Please select at least one player');
      return;
    }
    setPlayers(selectedPlayers);
    setShowPlayerSelection(false);
    setShowSettings(true);
  };

  const handleSettingsConfirm = () => {
    setShowSettings(false);
    setGameResult(null);
  };

  const handleGameEnd = (loser) => {
    setGameResult(loser);
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
    setPlayers([]);
    setGameResult(null);
    setShowPlayerSelection(false);
    setShowSettings(false);
  };

  const renderGame = () => {
    if (!selectedGame || !players.length) return null;

    switch (selectedGame) {
      case GAMES.MINESWEEPER:
        return (
          <Minesweeper
            players={players}
            gameSettings={gameSettings}
            onGameEnd={handleGameEnd}
            collars={collars}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ marginTop: '30px', padding: '20px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>Games</h2>
      
      {!selectedGame && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
          <button
            onClick={() => handleStartGame(GAMES.MINESWEEPER)}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Start Minesweeper
          </button>
        </div>
      )}

      {showPlayerSelection && (
        <PlayerSelectionModal
          collars={collars}
          onConfirm={handlePlayerSelection}
          onCancel={() => {
            setShowPlayerSelection(false);
            setSelectedGame(null);
          }}
        />
      )}

      {showSettings && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          zIndex: 1000,
          minWidth: '400px',
          maxWidth: '500px',
          border: '2px solid #333',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <h3 style={{ 
            marginBottom: '20px', 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: '#000000',
            textAlign: 'center'
          }}>
            Game Settings
          </h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: '#000000',
              fontSize: '16px',
              fontWeight: '500'
            }}>
              Strength (Max Percentage):
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={gameSettings.strength}
              onChange={(e) => setGameSettings({ ...gameSettings, strength: parseInt(e.target.value) })}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', marginTop: '5px', color: '#000000', fontSize: '18px', fontWeight: 'bold' }}>
              {gameSettings.strength}%
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: '#000000',
              fontSize: '16px',
              fontWeight: '500'
            }}>
              Duration (ms):
            </label>
            <input
              type="range"
              min="300"
              max="30000"
              value={gameSettings.duration}
              onChange={(e) => setGameSettings({ ...gameSettings, duration: parseInt(e.target.value) })}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', marginTop: '5px', color: '#000000', fontSize: '18px', fontWeight: 'bold' }}>
              {gameSettings.duration / 1000}s
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: '#000000',
              fontSize: '16px',
              fontWeight: '500'
            }}>
              Rows:
            </label>
            <input
              type="number"
              min="5"
              max="20"
              value={gameSettings.rows}
              onChange={(e) => setGameSettings({ ...gameSettings, rows: parseInt(e.target.value) || 10 })}
              style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: '#000000',
              fontSize: '16px',
              fontWeight: '500'
            }}>
              Columns:
            </label>
            <input
              type="number"
              min="5"
              max="20"
              value={gameSettings.cols}
              onChange={(e) => setGameSettings({ ...gameSettings, cols: parseInt(e.target.value) || 10 })}
              style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              color: '#000000',
              fontSize: '16px',
              fontWeight: '500'
            }}>
              Mines:
            </label>
            <input
              type="number"
              min="1"
              max={Math.floor(gameSettings.rows * gameSettings.cols * 0.3)}
              value={gameSettings.mines}
              onChange={(e) => setGameSettings({ ...gameSettings, mines: parseInt(e.target.value) || 10 })}
              style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '5px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button
              onClick={handleSettingsConfirm}
              style={{
                padding: '12px 24px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Start Game
            </button>
            <button
              onClick={() => {
                setShowSettings(false);
                setSelectedGame(null);
                setPlayers([]);
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {selectedGame && players.length > 0 && !showSettings && (
        <>
          {renderGame()}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={handleCloseGame}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Close Game
            </button>
          </div>
        </>
      )}

      {gameResult && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          zIndex: 1001,
          textAlign: 'center',
          minWidth: '400px',
          maxWidth: '500px',
          border: '2px solid #333'
        }}>
          <h3 style={{ 
            fontSize: '28px', 
            marginBottom: '20px',
            color: gameResult ? '#d32f2f' : '#2e7d32',
            fontWeight: 'bold'
          }}>
            {gameResult ? `${gameResult} lost!` : 'Game Won!'}
          </h3>
          <p style={{ 
            marginBottom: '30px',
            fontSize: '18px',
            color: '#000000',
            fontWeight: '500'
          }}>
            {gameResult ? `${gameResult} will receive a shock.` : 'All players survived!'}
          </p>
          <button
            onClick={() => setGameResult(null)}
            style={{
              padding: '12px 30px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 'bold'
            }}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}

export default GameContainer;

