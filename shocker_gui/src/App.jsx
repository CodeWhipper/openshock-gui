import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Shock from "./components/Shock";
import Settings from "./components/Settings";
import { NamesProvider, useNames } from "./utils/NamesContext";
import "./App.css";

// === LocalStorage Helper ===
function loadFromLocal(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) return JSON.parse(stored);
  } catch {}
  return defaultValue;
}

function saveToLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// === Sidebar ===
function Sidebar({ shockSelection, toggleShockSelection }) {
  const { names, toggleSidebarActive } = useNames();

  return (
    <div className="sidebar">
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
        <Link to="/settings">Settings</Link>
      </nav>
    </div>
  );
}

// === AppWrapper ===
function AppWrapper() {
  const location = useLocation();
  const showSidebar = location.pathname === "/";

  // Local Storage Zustände
  const [shockSelection, setShockSelection] = useState(() => loadFromLocal("shockSelection", false));
  const [percentage, setPercentage] = useState(() => loadFromLocal("shockPercentage", 1));
  const [duration, setDuration] = useState(() => loadFromLocal("shockDuration", 300));

  // Update Funktionen speichern Werte auch in LocalStorage
  const updateShockSelection = (val) => {
    setShockSelection(val);
    saveToLocal("shockSelection", val);
  };

  const updatePercentage = (val) => {
    setPercentage(val);
    saveToLocal("shockPercentage", val);
  };

  const updateDuration = (val) => {
    setDuration(val);
    saveToLocal("shockDuration", val);
  };

  return (
    <div className="app-container">
      {showSidebar && (
        <Sidebar shockSelection={shockSelection} toggleShockSelection={updateShockSelection} />
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
        </Routes>
      </div>
    </div>
  );
}

// === Haupt-App ===
export default function App() {
  return (
    <Router>
      <NamesProvider>
        <AppWrapper />
      </NamesProvider>
    </Router>
  );
}
