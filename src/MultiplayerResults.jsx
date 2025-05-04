import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function MultiplayerResults() {
  const { lobbyCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState({});
  const [loading, setLoading] = useState(true);

  const isHost = location.pathname.includes("host");
  const playerId = `${lobbyCode}-${isHost ? "host" : "player"}`;
  const opponentId = `${lobbyCode}-${isHost ? "player" : "host"}`;

  useEffect(() => {
    const fetchScores = async () => {
      const snap = await getDoc(doc(db, "lobbies", lobbyCode));
      const data = snap.data();

      setPlayers(data.players || {});
      setLoading(false);
    };

    fetchScores();
  }, [lobbyCode]);

  const handleRematch = async () => {
    const lobbyRef = doc(db, "lobbies", lobbyCode);

    await updateDoc(lobbyRef, {
      status: "waiting",
      questions: [],
      [`players.${playerId}.score`]: 0,
      [`players.${opponentId}.score`]: 0,
    });

    navigate(`/lobby/${lobbyCode}/${isHost ? "host" : "player"}`);
  };

  if (loading) return <p>Loading results...</p>;

  const myScore = players[playerId]?.score ?? 0;
  const oppScore = players[opponentId]?.score ?? 0;

  let resultMsg = "It's a tie!";
  if (myScore > oppScore) resultMsg = "You win! 🎉";
  else if (myScore < oppScore) resultMsg = "You lose 😢";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Match Results</h1>

      <div style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>
        <p><strong>You:</strong> {myScore}</p>
        <p><strong>Opponent:</strong> {oppScore}</p>
      </div>

      <h2 style={{ fontSize: "2rem", color: "#10b981", marginBottom: "2rem" }}>
        {resultMsg}
      </h2>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            fontSize: "1.25rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#6b7280",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Back to Menu
        </button>

        <button
          onClick={handleRematch}
          style={{
            fontSize: "1.25rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Rematch
        </button>
      </div>
    </div>
  );
}

export default MultiplayerResults;
