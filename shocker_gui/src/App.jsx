import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Shock from "./components/Shock";
import Settings from "./components/Settings";
import { useNames } from "./utils/NamesContext";
import "./App.css";

function Sidebar({ shockSelection, toggleShockSelection }) {
  const { names, toggleSidebarActive } = useNames();

  return (
    <div className="sidebar">
      <div className="mode-section">
        <span className="mode-label">
          {shockSelection ? "Multimode" : "Singlemode"}
        </span>
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

function AppWrapper() {
  const location = useLocation();
  const [shockSelection, setShockSelection] = useState(false);
  const { names, addName, updateName } = useNames();

  const showSidebar = location.pathname === "/";

  return (
    <div className="app-container">
      {showSidebar && (
        <Sidebar
          shockSelection={shockSelection}
          toggleShockSelection={setShockSelection}
        />
      )}

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Shock />} />
          <Route
            path="/settings"
            element={<Settings names={names} updateName={updateName} addName={addName} />}
          />
        </Routes>
      </div>
    </div>
  );
}

import { NamesProvider } from "./utils/NamesContext";

export default function App() {
  return (
    <Router>
      <NamesProvider>
        <AppWrapper />
      </NamesProvider>
    </Router>
  );
}
