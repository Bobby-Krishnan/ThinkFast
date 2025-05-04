import { useState } from "react";
import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function JoinLobby() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoin = async () => {
    const lobbyRef = doc(db, "lobbies", code);
    const docSnap = await getDoc(lobbyRef);

    if (!docSnap.exists()) {
      setError("Lobby not found.");
      return;
    }

    const lobbyData = docSnap.data();
    const playerCount = Object.keys(lobbyData.players || {}).length;

    if (playerCount >= 2) {
      setError("Lobby is full.");
      return;
    }

    const playerId = code + "-player";
    await updateDoc(lobbyRef, {
      [`players.${playerId}`]: { name: "Guest", score: 0 },
    });

    navigate(`/lobby/${code}/player`);
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
      <h2>Join a Lobby</h2>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Enter lobby code"
        style={{
          fontSize: "1.2rem",
          padding: "0.5rem",
          marginBottom: "1rem",
          textAlign: "center",
          width: "200px",
        }}
      />
      <button
        onClick={handleJoin}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1.2rem",
          backgroundColor: "#6366f1",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Join Lobby
      </button>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}

export default JoinLobby;
