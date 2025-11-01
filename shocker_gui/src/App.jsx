import { useState, useEffect } from 'react'
import './App.css'
import { get_shockers, control_collar, get_hub_id } from './Api_calls/Api_calls.jsx'
import { shock_all, shock_person, shock_random } from "./shock_modes.jsx"
import { socket } from "./socket";


function App() {
  const [collars, setCollars] = useState([]);
  const [percentage, setpercentage] = useState(50);
  const [duration, setduration] = useState(300);

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
    shock_random(collars, percentage, duration)
  }

  const handle_btn_All = () => {
    shock_all(collars, percentage, duration)
  }

  const handle_btn_Stop_All = () => {
    shock_all(collars,)
  }

  return (
    <div style={{ width: "1 vw" }}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 space-y-10">
        {/* --- Slider 1 --- */}
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-[75vw] max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Stärke auswählen</h2>
          <input
            type="range"
            min="1"
            max="100"
            value={percentage}
            onChange={(e) => setpercentage(e.target.value)}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <p className="mt-4 text-lg">
            Aktueller Wert:{" "}
            <input
              type="number"
              min="1"
              max="100"
              value={percentage}
              onChange={(e) => setpercentage(e.target.value)}
              className="font-bold text-blue-600 text-center w-16 border-b-2 border-blue-300 outline-none"
            />
          </p>
        </div>

        {/* --- Slider 2 --- */}
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-[75vw] max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Duration</h2>
          <input
            type="range"
            min="300"
            max="30000"
            value={duration}
            onChange={(e) => setduration(e.target.value)}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <p className="mt-4 text-lg">
            Aktuelle Duration:{" "}
            <input
              type="number"
              min="300"
              max="30000"
              value={duration / 1000}
              onChange={(e) => setduration(e.target.value * 1000)}
              className="font-bold text-blue-600 text-center w-20 border-b-2 border-blue-300 outline-none"
            />{" "}
            s
          </p>
        </div>
      </div>
      <div >
        <h1>Collar Manager</h1>
        <ul>
          {collars.map((c) => (
            <li style={{ padding: "5px" }} key={c.id}>
              <b style={{ marginRight: "10px" }}>{c.name} — Shock max: {c.max_shock} — Mute: {c.mute ? "🔇" : "🔊"} </b>
              <button style={{ marginRight: "10px" }} onClick={() => toggleMute(c.id, c.mute)}>
                {c.mute ? "Unmute" : "Mute"}
              </button>
              <button style={{ marginRight: "10px" }} onClick={() => setShock(c.id)}>Set Shock Maximum </button>
              <button style={{ marginRight: "10px" }} onClick={() => shock_person(c, percentage, duration)}>Shock {c.name}</button >
            </li>
          ))}
        </ul>
      </div>
      <button className='half-screen-btn' onClick={handle_btn_All}>All</button>
      <button className='half-screen-btn' onClick={handle_btn_Random}>Random</button>
      <button className='half-screen-btn' onClick={handle_btn_Stop_All}>STOP</button>
    </div>

  )
}

export default App;
