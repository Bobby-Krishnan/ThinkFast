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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            minHeight: "100vh",
            paddingTop: "1rem",
            padding: "2rem",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>ThinkFast</h1>
          <Settings onStart={handleStart} />
        </div>
      )}

      {gameStarted && (
        <Game settings={gameSettings} onGameEnd={handleGameEnd} />
      )}

      {!gameStarted && finalScore !== null && (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Time's up!</h2>
          <h3>Your score: {finalScore}</h3>
          <button onClick={() => setFinalScore(null)}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
