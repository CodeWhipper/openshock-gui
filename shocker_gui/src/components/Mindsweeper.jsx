import { useNavigate } from "react-router-dom";
import "./Mindsweeper.css";

export default function Mindsweeper() {
  const navigate = useNavigate();

  return (
    <div className="mindsweeper-page">
      <h1>Mindsweeper Game</h1>
      <p>This is the new Mindsweeper page. Implement your game logic here.</p>
      <button onClick={() => navigate("/")} className="btn-back">
        Back to Shock
      </button>
    </div>
  );
}
