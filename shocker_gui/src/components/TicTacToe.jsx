import { useNavigate } from "react-router-dom";
import "./TicTacToe.css";

export default function TicTacToe() {
  const navigate = useNavigate();

  return (
    <div className="TicTacToe-page">
      <h1>TicTacToe Game</h1>
      <p>This is the new TicTacToe page. Implement your game logic here.</p>
      <button onClick={() => navigate("/")} className="btn-back">
        Back to Shock
      </button>
    </div>
  );
}
