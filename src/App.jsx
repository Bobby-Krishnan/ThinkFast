import { useState, useEffect } from "react";
import Settings from "./Settings";
import Game from "./Game";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [countdownActive, setCountdownActive] = useState(false);
  const [count, setCount] = useState(5);

  const handleStart = (settings) => {
    setGameSettings(settings);
    setFinalScore(null);
    setCountdownActive(true);
    setCount(3); // start at 3
  };

  useEffect(() => {
    if (countdownActive && count > 0) {
      const timer = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (countdownActive && count === 0) {
      setCountdownActive(false);
      setGameStarted(true);
    }
  }, [countdownActive, count]);

  const handleGameEnd = (score) => {
    setFinalScore(score);
    setGameStarted(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {!gameStarted && !countdownActive && finalScore === null && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            minHeight: "100vh",
            paddingTop: "4rem",
            padding: "2rem",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
            ThinkFast
          </h1>
          <Settings onStart={handleStart} />
        </div>
      )}

      {countdownActive && (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "5rem",
            fontWeight: "bold",
            backgroundColor: "#f9fafb",
          }}
        >
          {count > 0 ? count : "Go!"}
        </div>
      )}

      {gameStarted && (
        <Game settings={gameSettings} onGameEnd={handleGameEnd} />
      )}

      {!gameStarted && finalScore !== null && !countdownActive && (
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
