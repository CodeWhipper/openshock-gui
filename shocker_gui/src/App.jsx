import { useState, useEffect } from 'react'
import './App.css'
import { get_shockers,control_collar} from './Api_calls/Api_calls.jsx'
import {shock_all} from "./shock_modes.jsx"
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

  const setShock = (id) => {
    const value = parseInt(prompt("Max Shock (0-100):"));
    socket.emit("updateCollar", { id, data: { max_shock: value } });
  };

  const addCollar = () => {
    const name = prompt("Name?");
    socket.emit("addCollar", { id: Date.now(), name });
  };

  return (
    <div style={{width: "1 vh"}}>
      <button className='half-screen-btn' onClick={control_collar}>All</button>
      <button className='half-screen-btn' onClick={control_collar}>Random</button>
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
