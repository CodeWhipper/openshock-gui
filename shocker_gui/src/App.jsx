import { useState, useEffect } from 'react'
import './App.css'
import { get_shockers, control_collar, get_hub_id } from './Api_calls/Api_calls.jsx'
import { shock_all, shock_person, shock_random } from "./shock_modes.jsx"
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

  //todo erstezen von 50 und 30 durch prozente  prozente 1 -100 und duration 300 - 100000

  const handle_btn_Random = () => {
    shock_random(collars, 50, 500)
  }

  const handle_btn_All =() => {
    shock_all(collars, 50, 500)
  }

  return (
    <div style={{ width: "1 vh" }}>
      <div >
        <h1>Collar Manager</h1>
        <ul>
          {collars.map((c) => (
            <li style={{padding: "5px"}} key={c.id}>
              <b style={{marginRight : "10px"}}>{c.name} — Shock max: {c.max_shock} — Mute: {c.mute ? "🔇" : "🔊"} </b>
              <button style={{marginRight : "10px"}} onClick={() => toggleMute(c.id, c.mute)}>
                {c.mute ? "Unmute" : "Mute"}
              </button>
              <button  style={{marginRight : "10px"}} onClick={() => setShock(c.id)}>Set Shock Maximum </button>
              <button style={{marginRight : "10px"}} onClick={() => shock_person(c, 50, 500)}>Shock {c.name}</button >
            </li>
          ))}
        </ul>
      </div>
      <button className='half-screen-btn' onClick={handle_btn_All}>All</button>
      <button className='half-screen-btn' onClick={handle_btn_Random}>Random</button>
      
    </div>

  )
}

export default App;
