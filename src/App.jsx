import { useState, useEffect } from "react";
import Settings from "./Settings";
import Game from "./Game";
import GlobalStats from "./GlobalStats";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebase";

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
    setCount(3);
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

  const handleGameEnd = async (score) => {
    setFinalScore(score);
    setGameStarted(false);

    try {
      const docRef = doc(db, "stats", "global");
      await updateDoc(docRef, {
        problemsSolved: increment(score),
      });
    } catch (error) {
      console.error("Failed to update global counter:", error);
    }
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
          <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
            ThinkFast
          </h1>
          <GlobalStats />
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
            justifyContent: "flex-start",
            paddingTop: "16rem",
            alignItems: "center",
            backgroundColor: "#f9fafb",
          }}
        >
          <h2 style={{ fontSize: "3rem", marginBottom: "3rem" }}>
            Score: {finalScore}
          </h2>
          <button
            onClick={() => setFinalScore(null)}
            style={{
              fontSize: "1.5rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
