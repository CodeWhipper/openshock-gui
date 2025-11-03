import { useState, useEffect, useRef } from 'react'
import './App.css'
import { get_shockers, control_collar, get_hub_id } from './Api_calls/Api_calls.jsx'
import { shock_all, stop_all, shock_person, shock_random, vibrate_person, sound_person, shock_spinning_wheel} from "./shock_modes.jsx"
import { socket } from "./socket";


function InteractiveGauge() {
  const [value, setValue] = useState(50); // Wert: 0–100
  const svgRef = useRef(null);

    // Hilfsfunktion: Wert begrenzen
  const clampValue = (v) => Math.max(0, Math.min(100, v));

  // Klick oder Drag auf das Tacho
  const handlePointer = (e) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = rect.width / 2; // Mittelpunkt X
    const cy = rect.height * 0.9; // Mittelpunkt Y (unten)

    const dx = x - cx;
    const dy = cy - y;

    // Winkel in Grad berechnen (-90° links bis +90° rechts)
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Begrenzen auf oberen Halbkreis (0° rechts bis 180° links)
    if (angle < 0) angle = 0;
    if (angle > 180) angle = 180;

    // In Prozentwert (0–100) umrechnen
   // const newValue = 100-(angle / 180)* 100;
   // setValue(newValue);

  // 0 % = links, 50 % = oben, 100 % = rechts
    const newValue = clampValue(100 - (angle / 180) * 100);
    setValue(newValue);

  };

  const angle = 180- (value / 100) * 180  ; // 0–100 => -90° bis +90°

  // Nadellänge
  const radius = 100;
  const needleLength = radius * 0.8;
  const needleX = 120 + needleLength * Math.cos((angle * Math.PI) / 180);
  const needleY = 120 - needleLength * Math.sin((angle * Math.PI) / 180);

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={svgRef}
        width="240"
        height="140"
        onMouseDown={handlePointer}
        onMouseMove={(e) => e.buttons === 1 && handlePointer(e)} // Drag mit gedrückter Maustaste
        onTouchMove={(e) => handlePointer(e.touches[0])} // Touch-Unterstützung
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        {/* Halbkreis-Hintergrund */}
        <path
          d="M20,120 A100,100 0 0,1 220,120"
          fill="none"
          stroke="#ddd"
          strokeWidth="12"
        />

        {/* Farbverlauf: Grün → Gelb → Rot */}
        <path
          d="M20,120 A100,100 0 0,1 220,120"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Nadel */}
        <line
          x1="120"
          y1="120"
          x2={needleX}
          y2={needleY}
          stroke="#ffffffff"
          strokeWidth="4"
          strokeLinecap="round"
          style={{
            transition: "x2 0.2s linear, y2 0.2s linear, transform 0.2s ease",
          }}
        />

        {/* Mittelpunkt */}
        <circle cx="120" cy="120" r="6" fill="#ffffffff" />
      </svg>

      {/* Interaktives Input-Feld */}
      <div className="mt-4 flex justify-center"></div>
      <input
        type="number"
        min={0}
        max={100}
        value={Math.round(value)}
        onChange={(e) => setValue(clampValue(Number(e.target.value)))}
        className="w-20 text-center font-bold text-blue-600 border-b-2 border-blue-300 outline-none"
      />
    </div>
  );
}
;


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
    stop_all(collars)
  }
  const handle_btn_Wheel = () => {
    shock_spinning_wheel(collars, percentage, duration)
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

        <div className="bg-white shadow-lg rounded-2xl p-8 text-center w-[75vw] max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Stärke auswählen</h2>
          <InteractiveGauge />
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
              <button style={{ marginRight: "10px", marginTop:"10px" }} onClick={() => setShock(c.id)}>Set Shock Maximum </button>
              <button style={{ marginRight: "10px", marginTop:"10px" }} onClick={() => shock_person(c, percentage, duration)}>Shock {c.name}</button >
              <button style={{ marginRight: "10px", marginTop:"10px" }} onClick={() => vibrate_person(c, percentage, duration)}>Vibrate {c.name}</button >
              <button style={{ marginRight: "10px", marginTop:"10px" }} onClick={() => sound_person(c, percentage, duration)}>Sound {c.name}</button >
            </li>
          ))}
        </ul>
      </div>
      <button className='half-screen-btn' onClick={handle_btn_All}>All</button>
      <button className='half-screen-btn' onClick={handle_btn_Random}>Random</button>
      <button className='half-screen-btn' onClick={handle_btn_Wheel}>Wheel of pain</button>
      <button className='half-screen-btn' onClick={handle_btn_Stop_All}>STOP</button>      

    </div>

  )
}

export default App;
