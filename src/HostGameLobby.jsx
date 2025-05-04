import { useEffect, useState } from "react";
import { db } from "./firebase";
import { useNavigate, useParams } from "react-router-dom";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

// Simple random question generator
function generateQuestions(settings, count = 200) {
  const ops = Object.keys(settings.operations).filter((op) => settings.operations[op]);
  const getRand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const questions = [];

  for (let i = 0; i < count; i++) {
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, text;

    switch (op) {
      case "addition":
        a = getRand(settings.ranges.addSub.minA, settings.ranges.addSub.maxA);
        b = getRand(settings.ranges.addSub.minB, settings.ranges.addSub.maxB);
        text = `${a} + ${b}`;
        break;
      case "subtraction":
        a = getRand(settings.ranges.addSub.minA, settings.ranges.addSub.maxA);
        b = getRand(settings.ranges.addSub.minB, settings.ranges.addSub.maxB);
        text = `${a + b} - ${b}`;
        break;
      case "multiplication":
        a = getRand(settings.ranges.mulDiv.minA, settings.ranges.mulDiv.maxA);
        b = getRand(settings.ranges.mulDiv.minB, settings.ranges.mulDiv.maxB);
        text = `${a} × ${b}`;
        break;
      case "division":
        a = getRand(settings.ranges.mulDiv.minA, settings.ranges.mulDiv.maxA);
        b = getRand(settings.ranges.mulDiv.minB, settings.ranges.mulDiv.maxB);
        text = `${a * b} ÷ ${a}`;
        break;
      default:
        text = "1 + 1";
    }

    questions.push(text);
  }

  return questions;
}

function HostGameLobby() {
  const { lobbyCode } = useParams();
  const [players, setPlayers] = useState([]);
  const [settings] = useState({
    duration: 60,
    operations: {
      addition: true,
      subtraction: true,
      multiplication: true,
      division: true,
    },
    ranges: {
      addSub: { minA: 2, maxA: 100, minB: 2, maxB: 100 },
      mulDiv: { minA: 2, maxA: 12, minB: 2, maxB: 100 },
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    const lobbyRef = doc(db, "lobbies", lobbyCode);
    const unsubscribe = onSnapshot(lobbyRef, (snap) => {
      const data = snap.data();
      const playerList = Object.values(data.players || {});
      setPlayers(playerList);

      if (data.status === "in_progress") {
        navigate(`/lobby/${lobbyCode}/host/game`);
      }
    });

    return () => unsubscribe();
  }, [lobbyCode, navigate]);

  const handleStart = async () => {
    const lobbyRef = doc(db, "lobbies", lobbyCode);
    const questions = generateQuestions(settings);

    await updateDoc(lobbyRef, {
      status: "in_progress",
      questions,
      settings,
      startTime: Date.now(),
    });
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Lobby: {lobbyCode}</h2>
      <h3>Waiting for player...</h3>
      <ul>
        {players.map((p, idx) => (
          <li key={idx}>{p.name}</li>
        ))}
      </ul>
      {players.length >= 2 && (
        <button
          onClick={handleStart}
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

export default HostGameLobby;
