import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

export default function Settings({ names, updateName, addName }) {
  const navigate = useNavigate();
  const [newName, setNewName] = useState("");

  // Lokaler State für Inputs
  const [localValues, setLocalValues] = useState({});

  // Immer wenn names sich ändern, localValues synchronisieren (aber nur falls noch nicht existiert)
  useEffect(() => {
    const newLocal = {};
    names.forEach((n) => {
      if (!localValues[n.id]) {
        newLocal[n.id] = { localMaxShock: n.max_shock };
      } else {
        newLocal[n.id] = { ...localValues[n.id] };
      }
    });
    setLocalValues(newLocal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names]);

  const updateLocalMaxShock = (id, value) => {
    setLocalValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], localMaxShock: value }
    }));
  };

  const handleBlurMaxShock = (id) => {
    const val = Number(localValues[id]?.localMaxShock ?? 0);
    const clamped = Math.max(0, Math.min(100, val));
    updateName(id, "max_shock", clamped);
  };

  return (
    <div>
      <h1>Settings Page</h1>

      <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
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

              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={n.active}
                    onChange={() => updateName(n.id, "active", !n.active)}
                  />
                  <span className="slider"></span>
                </label>
              </td>

              <td>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={Number(n.max_shock)}
                  onChange={(e) =>
                    updateName(
                      n.id,
                      "max_shock",
                      Math.max(0, Math.min(100, Number(e.target.value)))
                    )
                  }
                />
              </td>

              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={n.game_random}
                    onChange={() => updateName(n.id, "game_random", !n.game_random)}
                  />
                  <span className="slider"></span>
                </label>
              </td>

              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={n.game_wheel}
                    onChange={() => updateName(n.id, "game_wheel", !n.game_wheel)}
                  />
                  <span className="slider"></span>
                </label>
              </td>

              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={n.game_tick}
                    onChange={() => updateName(n.id, "game_tick", !n.game_tick)}
                  />
                  <span className="slider"></span>
                </label>
              </td>

              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={n.game_mine}
                    onChange={() => updateName(n.id, "game_mine", !n.game_mine)}
                  />
                  <span className="slider"></span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="New name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ padding: "5px" }}
        />
        <button
          onClick={() => {
            if (newName.trim() !== "") {
              addName(newName.trim());
              setNewName("");
            }
          }}
          style={{
            padding: "5px 10px",
            marginLeft: "10px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Name
        </button>
      </div>
    </div>
  );
}
