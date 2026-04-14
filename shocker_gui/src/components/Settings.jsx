import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNames } from "../utils/NamesContext";
import "./Settings.css";
import { socket } from "../socket.js"

export default function Settings() {
  const navigate = useNavigate();
  const { names, updateName, addName } = useNames();
  const [newName, setNewName] = useState("");

  // Helper for rendering checkbox toggles
  const renderSwitch = (checked, onChange) => (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider"></span>
    </label>
  );

  return (
    <div className="settings-page">
      <h1>Settings Page</h1>

      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        Go Back to Shock
      </button>
     
      <table className="settings-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Active</th>
            <th>Max Shock</th>
            <th>Random</th>
            <th>Wheel</th>
            <th>Tick</th>
            <th>Mine</th>
          </tr>
        </thead>
        <tbody>
          {names.map((n) => (
            <tr key={n.id}>
              <td>{n.name}</td>
              <td>{renderSwitch(n.active, () => updateName(n.id, "active", !n.active))}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={n.max_shock}
                  onChange={(e) =>
                    updateName(
                      n.id,
                      "max_shock",
                      Math.max(0, Math.min(100, Number(e.target.value)))
                    )
                  }
                />
              </td>
              <td>{renderSwitch(n.game_random, () => updateName(n.id, "game_random", !n.game_random))}</td>
              <td>{renderSwitch(n.game_wheel, () => updateName(n.id, "game_wheel", !n.game_wheel))}</td>
              <td>{renderSwitch(n.game_tick, () => updateName(n.id, "game_tick", !n.game_tick))}</td>
              <td>{renderSwitch(n.game_mine, () => updateName(n.id, "game_mine", !n.game_mine))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-name-section">
        <input
          type="text"
          placeholder="New name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={() => {
            const trimmed = newName.trim();
            if (trimmed) {
              addName(trimmed);
              setNewName("");
            }
          }}
        >
          Add Name
        </button>
      </div>
       <button onClick={() => {socket.emit("clearcollars"); window.location.reload();}}>
        Alle Halsbänder zurücksetzen
      </button>
    </div>
  );
}
