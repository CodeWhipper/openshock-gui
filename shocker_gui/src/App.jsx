import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Shock from "./components/Shock";
import Settings from "./components/Settings";
import Mindsweeper from "./components/Mindsweeper";
import TicTacToe from "./components/TicTacToe";
import { NamesProvider, useNames } from "./utils/NamesContext";
import "./App.css";

// === LocalStorage Helpers ===
const loadFromLocal = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// === Sidebar Component ===
function Sidebar({ shockSelection, toggleShockSelection, isOpen, onClose }) {
  const { names, toggleSidebarActive } = useNames();

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <div className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        <button className="sidebar-close-btn" onClick={onClose}>✕</button>

        <div className="mode-section">
          <span className="mode-label">{shockSelection ? "Multimode" : "Singlemode"}</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={shockSelection}
              onChange={() => toggleShockSelection(!shockSelection)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="names-section">
          {names.map((n) => (
            <div key={n.id} className="name-item">
              <span>{n.name}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={n.sidebarActive}
                  onChange={() => toggleSidebarActive(n.id)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}
        </div>

        <nav className="nav-links">
          <Link to="/settings" onClick={onClose}>Settings</Link>
        </nav>
      </div>
    </>
  );
}

// === App Wrapper ===
function AppWrapper() {
  const location = useLocation();
  const showSidebar = location.pathname === "/" || location.pathname === "/settings";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shockSelection, setShockSelection] = useState(() => loadFromLocal("shockSelection", false));
  const [percentage, setPercentage] = useState(() => loadFromLocal("shockPercentage", 1));
  const [duration, setDuration] = useState(() => loadFromLocal("shockDuration", 300));

  const updateShockSelection = (value) => { setShockSelection(value); saveToLocal("shockSelection", value); };
  const updatePercentage     = (value) => { setPercentage(value);     saveToLocal("shockPercentage", value); };
  const updateDuration       = (value) => { setDuration(value);       saveToLocal("shockDuration", value); };

  return (
    <div className="app-container">
      {showSidebar && (
        <>
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Menü öffnen"
          >
            <span /><span /><span />
          </button>

          <Sidebar
            shockSelection={shockSelection}
            toggleShockSelection={updateShockSelection}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </>
      )}

      <div className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Shock
                percentage={percentage}
                setPercentage={updatePercentage}
                duration={duration}
                setDuration={updateDuration}
              />
            }
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/mindsweeper" element={<Mindsweeper />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
        </Routes>
      </div>
    </div>
  );
}

// === Main App ===
export default function App() {
  return (
    <Router>
      <NamesProvider>
        <AppWrapper />
      </NamesProvider>
    </Router>
  );
}