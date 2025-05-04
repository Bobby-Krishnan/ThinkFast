import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function MultiplayerGame() {
  const { lobbyCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const inputRef = useRef(null);
  const finishedRef = useRef(false);
  const scoreRef = useRef(0);

  const isHost = location.pathname.includes("host");
  const playerId = `${lobbyCode}-${isHost ? "host" : "player"}`;

  useEffect(() => {
    const fetchLobby = async () => {
      const snap = await getDoc(doc(db, "lobbies", lobbyCode));
      const data = snap.data();

      setSettings(data.settings);
      setQuestions(data.questions);
      setStartTime(data.startTime);
    };

    fetchLobby();
  }, [lobbyCode]);

  useEffect(() => {
    if (!startTime || !settings) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = settings.duration - elapsed;

      if (remaining <= 0) {
        clearInterval(interval);
        finishGame();
      } else {
        setTimeLeft(remaining);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [startTime, settings]);

  // 🔧 Robust focus fix for host/player
  useEffect(() => {
    const interval = setInterval(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const correctAnswer = eval(currentQ.replace("×", "*").replace("÷", "/"));

    if (parseInt(value) === correctAnswer) {
      setScore((prev) => {
        const newScore = prev + 1;
        scoreRef.current = newScore;
        return newScore;
      });
      setCurrentIndex((prev) => prev + 1);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const currentQ = questions[currentIndex];
      const correctAnswer = eval(currentQ.replace("×", "*").replace("÷", "/"));
      const numeric = parseInt(input);

      if (numeric !== correctAnswer) {
        setScore((prev) => {
          const newScore = Math.max(0, prev - 1);
          scoreRef.current = newScore;
          return newScore;
        });
        setCurrentIndex((i) => i + 1);
        setInput("");
      }
    }
  };

  const finishGame = async () => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    try {
      await updateDoc(doc(db, "lobbies", lobbyCode), {
        [`players.${playerId}.score`]: scoreRef.current,
      });

      navigate(`/lobby/${lobbyCode}/${isHost ? "host" : "player"}/results`);
    } catch (err) {
      console.error("Error submitting score:", err);
    }
  };

  if (!settings || !questions.length) return <p>Loading game...</p>;

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* Top bar */}
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>
        <div>Time: {timeLeft ?? settings.duration}s</div>
        <div>Score: {score}</div>
      </div>

      {/* Question */}
      <div style={{ fontSize: "3rem", fontWeight: "bold", marginTop: "-10rem" }}>
        {questions[currentIndex] || "Done!"} ={" "}
        <input
          type="number"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          style={{
            fontSize: "2rem",
            padding: "0.25rem",
            width: "150px",
            textAlign: "center",
            appearance: "textfield",
          }}
        />
      </div>

      <div style={{ height: "2rem" }} />
    </div>
  );
}

export default MultiplayerGame;
