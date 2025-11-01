import { useState, useEffect } from 'react'
import './App.css'
import { get_shockers, control_collar, get_hub_id } from './Api_calls/Api_calls.jsx'
import { shock_all, shock_random } from "./shock_modes.jsx"
import { socket } from "./socket";


function App() {
  const [collars, setCollars] = useState([]);

  useEffect(() => {
    socket.on("update", (data) => {
      setCollars(data);
    });

    return () => socket.off("update");
  }, []);

  const toggleMute = (id, mute) => {
    socket.emit("updateCollar", { id, data: { mute: !mute } });
  };

  useEffect(() => {
    const sync = async () => {
      const shockers = await get_shockers()
      socket.emit("syncCollars", shockers)
    }
    sync()
  }, []);


  const setShock = (id) => {
    const value = parseInt(prompt("Max Shock (0-100):"));
    socket.emit("updateCollar", { id, data: { max_shock: value } });
  };

  const addCollar = () => {
    const name = prompt("Name?");
    socket.emit("addCollar", { id: Date.now(), name });
  };

  //todo erstezen von 50 und 30 durch prozente  prozente 1 -100 und duration 300 - 100000

  const handle_btn_Random = () => {
    shock_random(collars, 500)
  }

  const handle_btn_All =() => {
    shock_all(collars, 50, 500)
  }

  return (
    <div style={{ width: "1 vh" }}>
      <button className='half-screen-btn' onClick={handle_btn_All}>All</button>
      <button className='half-screen-btn' onClick={handle_btn_Random}>Random</button>
      <div style={{ padding: "2rem" }}>
        <h1>Collar Manager</h1>
        <button onClick={addCollar}>+ Add Collar</button>
        <ul>
          {collars.map((c) => (
            <li key={c.id}>
              <b>{c.name}</b> — Shock: {c.max_shock} — Mute: {c.mute ? "🔇" : "🔊"}
              <button onClick={() => toggleMute(c.id, c.mute)}>
                {c.mute ? "Unmute" : "Mute"}
              </button>
              <button onClick={() => setShock(c.id)}>Set Shock</button>
            </li>
          ))}
        </ul>
      </div>
    </div>

  )
}

export default App;
