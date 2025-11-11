import { useState, useRef } from "react";
import { useNames } from "../utils/NamesContext";
import {
  shock_all,
  stop_all,
  shock_random,
  shock_spinning_wheel,
  shock_person,
  vibrate_person,
  sound_person
} from "../shock_modes";
import "./Shock.css";
import { FaBolt, FaVolumeUp } from "react-icons/fa";
import { LuVibrate } from "react-icons/lu";

function InteractiveGauge({ min = 0, max = 100, value, setValue, displayInSeconds = false, integerOnly = false }) {
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

    let newValue = min + ((180 - angle) / 180) * (max - min);

    // Stärke: ganze Zahlen
    if (integerOnly) newValue = Math.round(newValue);

    // Dauer: auf ganze Zahl speichern, Anzeige bleibt in Sekunden
    if (displayInSeconds) newValue = Math.round(newValue);

    setValue(clampValue(newValue));
  };

  const angle = 180 - ((value - min) / (max - min)) * 180;
  const radius = 100;
  const needleLength = radius * 0.8;
  const needleX = 120 + needleLength * Math.cos((angle * Math.PI) / 180);
  const needleY = 120 - needleLength * Math.sin((angle * Math.PI) / 180);

  return (
    <div className="gauge-container">
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
        onChange={(e) => {
          let val = clampValue(Number(e.target.value) * (displayInSeconds ? 1000 : 1));
          if (integerOnly || displayInSeconds) val = Math.round(val);
          setValue(val);
        }}
        className="gauge-input"
      />
    </div>
  );
}

export default function Shock() {
  const { names } = useNames();
  const [percentage, setPercentage] = useState(1);
  const [duration, setDuration] = useState(300);

  const activeNames = names.filter((n) => n.active);

  const handleShock = () => activeNames.forEach((n) => shock_person(n, percentage, duration));
  const handleVibration = () => activeNames.forEach((n) => vibrate_person(n, percentage, duration));
  const handleSound = () => activeNames.forEach((n) => sound_person(n, percentage, duration));

  const handleAll = () => shock_all(activeNames, percentage, duration);
  const handleRandom = () => shock_random(activeNames, percentage, duration);
  const handleWheel = () => shock_spinning_wheel(activeNames, percentage, duration);
  const handleStopAll = () => stop_all(activeNames);

  return (
    <div className="shock-page">
      <div className="gauges-row">
        <div className="gauge-section">
          <h2 className="gauge-title">Stärke</h2>
          <InteractiveGauge min={0} max={100} value={percentage} setValue={setPercentage} integerOnly={true} />
        </div>
        <div className="gauge-section">
          <h2 className="gauge-title">Dauer</h2>
          <InteractiveGauge min={300} max={30000} value={duration} setValue={setDuration} displayInSeconds />
        </div>
      </div>

      <div className="shock-buttons">
        <button onClick={handleShock}><FaBolt /></button>
        <button onClick={handleVibration}><LuVibrate /></button>
        <button onClick={handleSound}><FaVolumeUp /></button>
      </div>

      <div>
        <button onClick={handleStopAll} className="btn-shock stop">Stop All</button>
      </div>

      <div className="shock-buttons">
        <button onClick={handleAll}>Shock All</button>
        <button onClick={handleRandom}>Shock Random</button>
        <button onClick={handleWheel}>Wheel of Pain</button>
      </div>
    </div>
  );
}
