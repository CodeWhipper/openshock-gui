import { useRef } from "react";
import { useNames } from "../utils/NamesContext";
import { useNavigate } from "react-router-dom";
import {
  shock_all,
  stop_all,
  shock_random,
  shock_spinning_wheel,
  shock_person,
  vibrate_person,
  sound_person,
} from "../shock_modes";
import { FaBolt, FaVolumeUp } from "react-icons/fa";
import { LuVibrate } from "react-icons/lu";
import "./Shock.css";

// === Interactive Gauge Component ===
function InteractiveGauge({ min = 0, max = 100, value, setValue, displayInSeconds = false, integerOnly = false, exponent = 1 }) {
  const svgRef = useRef(null);

  const clampValue = (v) => Math.max(min, Math.min(max, v));

  const valueToNorm = (v) => Math.pow((v - min) / (max - min), 1 / exponent);
  const normToValue = (n) => min + Math.pow(n, exponent) * (max - min);

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
    angle = Math.max(0, Math.min(180, angle));

    const norm = (180 - angle) / 180;
    let newValue = normToValue(norm);
    if (integerOnly || displayInSeconds) newValue = Math.round(newValue);
    setValue(clampValue(newValue));
  };

  const norm = valueToNorm(value);
  const angle = 180 - norm * 180;
  const radius = 100;
  const needleLength = radius * 0.8;
  const needleX = 120 + needleLength * Math.cos((angle * Math.PI) / 180);
  const needleY = 120 - needleLength * Math.sin((angle * Math.PI) / 180);

  // Linearer Step: 1 für Stärke, 100ms für Dauer
  const step = displayInSeconds ? 100 : 1;

  const increment = () => setValue(clampValue(Math.round(value + step)));
  const decrement = () => setValue(clampValue(Math.round(value - step)));

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
          x1="120" y1="120"
          x2={needleX} y2={needleY}
          stroke="#fff" strokeWidth="4" strokeLinecap="round"
          style={{ transition: "x2 0.2s linear, y2 0.2s linear" }}
        />
        <circle cx="120" cy="120" r="6" fill="#fff" />
      </svg>

      <div className="gauge-input-row">
        <button className="gauge-step-btn" onClick={decrement}>−</button>
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
        <button className="gauge-step-btn" onClick={increment}>+</button>
      </div>
    </div>
  );
}

// === Shock Component ===
export default function Shock({ percentage, setPercentage, duration, setDuration }) {
  const { names } = useNames();
  const navigate = useNavigate();
  const activeNames = names.filter((n) => n.active);

  const runOnActive = (fn) => activeNames.forEach((n) => fn(n, percentage, duration));

  return (
    <div className="shock-page">
      <div className="gauges-row">
        <div className="gauge-section">
          <h2 className="gauge-title">Stärke</h2>
          <InteractiveGauge
            min={1} max={100}
            value={percentage} setValue={setPercentage}
            integerOnly exponent={1.7}
          />
        </div>
        <div className="gauge-section">
          <h2 className="gauge-title">Dauer</h2>
          <InteractiveGauge
            min={300} max={30000}
            value={duration} setValue={setDuration}
            displayInSeconds exponent={4}
          />
        </div>
      </div>

      <div className="shock-buttons">
        <button onClick={() => runOnActive(shock_person)}><FaBolt /></button>
        <button onClick={() => runOnActive(vibrate_person)}><LuVibrate /></button>
        <button onClick={() => runOnActive(sound_person)}><FaVolumeUp /></button>
      </div>

      <div>
        <button onClick={() => stop_all(activeNames)} className="btn-shock stop">Stop All</button>
      </div>

      <div className="shock-buttons">
        <button onClick={() => shock_all(activeNames, percentage, duration)}>Shock All</button>
        <button onClick={() => shock_random(activeNames, percentage, duration)}>Shock Random</button>
        <button onClick={() => shock_spinning_wheel(activeNames, percentage, duration)}>Wheel of Pain</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/mindsweeper")} className="btn-shock mindsweeper">
          Go to Mindsweeper
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/tictactoe")} className="btn-shock TicTacToe">
          Go to TicTacToe
        </button>
      </div>
    </div>
  );
}