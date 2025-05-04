import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function generateLobbyCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function CreateLobby() {
  const [lobbyCode, setLobbyCode] = useState("");
  const [playerName] = useState("Host"); // In the future we allow name entry
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const code = generateLobbyCode();
    const lobbyRef = doc(db, "lobbies", code);

    const newLobby = {
      hostId: code + "-host",
      status: "waiting",
      players: {
        [code + "-host"]: { name: playerName, score: 0 },
      },
      createdAt: Date.now(),
    };

    setDoc(lobbyRef, newLobby).then(() => {
      setLobbyCode(code);
    });

    const unsubscribe = onSnapshot(lobbyRef, (docSnap) => {
      const data = docSnap.data();
      const playerCount = Object.keys(data.players || {}).length;

      if (playerCount === 2 && data.status === "waiting") {
        setIsReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleStartGame = () => {
    navigate(`/lobby/${lobbyCode}/host`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        padding: "2rem",
      }}
    >
      <h2>Lobby Created</h2>
      <p>Share this code with a friend:</p>
      <h1 style={{ fontSize: "2.5rem", letterSpacing: "0.1em" }}>
        {lobbyCode}
      </h1>

      {!isReady ? (
        <p style={{ marginTop: "2rem" }}>Waiting for another player...</p>
      ) : (
        <button
          onClick={handleStartGame}
          style={{
            marginTop: "2rem",
            padding: "0.75rem 1.5rem",
            fontSize: "1.2rem",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Start Game
        </button>
      )}
    </div>
  );
}

export default CreateLobby;
