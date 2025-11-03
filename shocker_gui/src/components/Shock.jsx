import { useState, useEffect, useRef } from "react";
import { socket } from "../socket"; // adjust path if needed
import {
  shock_all,
  stop_all,
  shock_random,
  shock_spinning_wheel,
} from "../shock_modes"; // adjust path
import { get_shockers } from "../Api_calls/Api_calls"; // adjust path
import "./Shock.css"; // optional styling

// Interactive Gauge Component
function InteractiveGauge({ min = 0, max = 100, value, setValue, displayInSeconds = false }) {
  const svgRef = useRef(null);

  const clampValue = (v) => Math.max(min, Math.min(max, v));

  const handlePointer = (e) => {
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches[0].clientX;
    const clientY = e.clientY ?? e.touches[0].clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const cx = rect.width / 2;
    const cy = rect.height * 0.9;

    const dx = x - cx;
    const dy = cy - y;

    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle = 0;
    if (angle > 180) angle = 180;

    const newValue = clampValue(min + ((180 - angle) / 180) * (max - min));
    setValue(newValue);
  };

  const angle = 180 - ((value - min) / (max - min)) * 180;
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
        onMouseMove={(e) => e.buttons === 1 && handlePointer(e)}
        onTouchMove={handlePointer}
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        <path d="M20,120 A100,100 0 0,1 220,120" fill="none" stroke="#ddd" strokeWidth="12" />
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
        <line
          x1="120"
          y1="120"
          x2={needleX}
          y2={needleY}
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ transition: "x2 0.2s linear, y2 0.2s linear" }}
        />
        <circle cx="120" cy="120" r="6" fill="#fff" />
      </svg>
      <input
        type="number"
        min={displayInSeconds ? min / 1000 : min}
        max={displayInSeconds ? max / 1000 : max}
        step={displayInSeconds ? 0.1 : 1}
        value={displayInSeconds ? (value / 1000).toFixed(1) : Math.round(value)}
        onChange={(e) => setValue(clampValue(Number(e.target.value)))}
        className="w-20 text-center font-bold text-blue-600 border-b-2 border-blue-300 outline-none mt-2"
      />
    </div>
  );
}

// Shock Page Component
export default function Shock() {
  const [collars, setCollars] = useState([]);
  const [percentage, setPercentage] = useState(1);
  const [duration, setDuration] = useState(300);

  useEffect(() => {
    socket.on("update", (data) => setCollars(data));
    return () => socket.off("update");
  }, []);

  useEffect(() => {
    const sync = async () => {
      const shockers = await get_shockers();
      socket.emit("syncCollars", shockers);
    };
    sync();
  }, []);

  const handleRandom = () => shock_random(collars, percentage, duration);
  const handleAll = () => shock_all(collars, percentage, duration);
  const handleStopAll = () => stop_all(collars);
  const handleWheel = () => shock_spinning_wheel(collars, percentage, duration);

  return (
    <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
      <div>
        <h2 className="text-xl font-semibold mb-4">Stärke</h2>
        <InteractiveGauge min={0} max={100} value={percentage} setValue={setPercentage} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Dauer</h2>
        <InteractiveGauge
          min={300}
          max={30000}
          value={duration}
          setValue={setDuration}
          displayInSeconds={true}
        />
      </div>
    </div>
  );
}
