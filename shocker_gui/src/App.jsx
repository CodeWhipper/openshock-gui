import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Shock from "./components/Shock";
import Settings from "./components/Settings";
import "./App.css";

function Sidebar({ names, toggleSidebarActive, shockSelection, toggleShockSelection }) {
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

  const [names, setNames] = useState([
    {
      id: 1,
      name: "Alice",
      sidebarActive: false,
      active: false,
      max_shock: 50,
      game_random: false,
      game_wheel: false,
      game_tick: false,
      game_mine: false,
    },
    {
      id: 2,
      name: "Bob",
      sidebarActive: true,
      active: true,
      max_shock: 70,
      game_random: true,
      game_wheel: false,
      game_tick: true,
      game_mine: false,
    },
  ]);

  const toggleSidebarActive = (id) => {
    setNames((prev) =>
      prev.map((n) => (n.id === id ? { ...n, sidebarActive: !n.sidebarActive } : n))
    );
  };

  const updateName = (id, key, value) => {
    setNames((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [key]: value } : n))
    );
  };

  const addName = (newName) => {
    const nextId = names.length > 0 ? Math.max(...names.map(n => n.id)) + 1 : 1;
    setNames([
      ...names,
      {
        id: nextId,
        name: newName,
        sidebarActive: false,
        active: false,
        max_shock: 50,
        game_random: false,
        game_wheel: false,
        game_tick: false,
        game_mine: false,
      },
    ]);
  };

  const showSidebar = location.pathname === "/";

  return (
    <div className="app-container">
      {showSidebar && (
        <Sidebar
          names={names}
          toggleSidebarActive={toggleSidebarActive}
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

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
