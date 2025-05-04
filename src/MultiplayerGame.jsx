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
  const inputRef = useRef(null);

  const isHost = location.pathname.includes("host");
  const playerId = `${lobbyCode}-${isHost ? "host" : "player"}`;

  useEffect(() => {
    const fetchLobby = async () => {
      const snap = await getDoc(doc(db, "lobbies", lobbyCode));
      const data = snap.data();
      setSettings(data.settings);
      setQuestions(data.questions);
      setTimeLeft(data.settings.duration);
    };

    fetchLobby();
  }, [lobbyCode]);

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      finishGame();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleInput = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const answer = eval(currentQ.replace("×", "*").replace("÷", "/"));

    if (parseInt(input) === answer) {
      setScore((prev) => prev + 1);
      setCurrentIndex((prev) => prev + 1);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const currentQ = questions[currentIndex];
      const answer = eval(currentQ.replace("×", "*").replace("÷", "/"));

      if (parseInt(input) !== answer) {
        setScore((prev) => Math.max(0, prev - 1));
        setCurrentIndex((prev) => prev + 1);
        setInput("");
      }
    }
  };

  const finishGame = async () => {
    await updateDoc(doc(db, "lobbies", lobbyCode), {
      [`players.${playerId}.score`]: score,
    });
    navigate(`/lobby/${lobbyCode}/results`);
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
        <div>Time: {timeLeft}s</div>
        <div>Score: {score}</div>
      </div>

      {/* Question */}
      <div style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "4rem" }}>
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
            width: "120px",
            textAlign: "center",
            appearance: "textfield",
          }}
        />
      </div>

      {/* End */}
      <div style={{ height: "1rem" }} />
    </div>
  );
}

export default MultiplayerGame;
