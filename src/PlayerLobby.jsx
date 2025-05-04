import { useEffect, useState } from "react";
import { db } from "./firebase";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";

function PlayerLobby() {
  const { lobbyCode } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const lobbyRef = doc(db, "lobbies", lobbyCode);

    const unsubscribe = onSnapshot(lobbyRef, (snap) => {
      const data = snap.data();
      const playerList = Object.values(data.players || {});
      setPlayers(playerList);

      if (data.status === "in_progress") {
        navigate(`/lobby/${lobbyCode}/player/game`);
      }
    });

    return () => unsubscribe();
  }, [lobbyCode, navigate]);

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
        textAlign: "center",
      }}
    >
      <h2>Joined Lobby: {lobbyCode}</h2>
      <p>Waiting for host to start the game...</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {players.map((p, idx) => (
          <li key={idx} style={{ fontSize: "1.1rem" }}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerLobby;
