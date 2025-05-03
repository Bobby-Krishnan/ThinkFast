import { useState } from "react";
import Settings from "./Settings";
import Game from "./Game";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState(null);
  const [finalScore, setFinalScore] = useState(null);

  const handleStart = (settings) => {
    setGameSettings(settings);
    setGameStarted(true);
    setFinalScore(null);
  };

  const handleGameEnd = (score) => {
    setFinalScore(score);
    setGameStarted(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {!gameStarted && finalScore === null && (
        <>
          <h1 style={{ textAlign: "center", marginTop: "2rem" }}>ThinkFast</h1>
          <Settings onStart={handleStart} />
        </>
      )}

      {gameStarted && <Game settings={gameSettings} onGameEnd={handleGameEnd} />}

      {!gameStarted && finalScore !== null && (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h2>Time's up!</h2>
          <h3>Your score: {finalScore}</h3>
          <button onClick={() => setFinalScore(null)}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
