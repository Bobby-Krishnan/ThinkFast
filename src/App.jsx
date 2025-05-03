import { useState } from "react";
import Settings from "./Settings";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSettings, setGameSettings] = useState(null);

  const handleStart = (settings) => {
    setGameSettings(settings);
    setGameStarted(true);
    console.log("Starting game with settings:", settings);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "1rem",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>ThinkFast</h1>
      {!gameStarted && <Settings onStart={handleStart} />}
      {gameStarted && (
        <div style={{ textAlign: "center" }}>
          <h2>Game would start here...</h2>
        </div>
      )}
    </div>
  );
}

export default App;
