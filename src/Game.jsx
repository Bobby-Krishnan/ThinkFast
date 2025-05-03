import { useEffect, useRef, useState } from "react";

function Game({ settings, onGameEnd }) {
  const [timeLeft, setTimeLeft] = useState(settings.duration);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [input, setInput] = useState("");

  const inputRef = useRef(null);

  // Focus input box on start
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onGameEnd(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [score, onGameEnd]);

  // Generate a random question
  const generateQuestion = () => {
    const ops = Object.keys(settings.operations).filter((op) => settings.operations[op]);
    const op = ops[Math.floor(Math.random() * ops.length)];

    const getRand = () =>
      Math.floor(Math.random() * (settings.ranges.max - settings.ranges.min + 1)) +
      settings.ranges.min;

    let a = getRand();
    let b = getRand();
    let questionText = "";
    let answer = 0;

    switch (op) {
      case "addition":
        questionText = `${a} + ${b}`;
        answer = a + b;
        break;
      case "subtraction":
        questionText = `${a + b} - ${b}`;
        answer = a;
        break;
      case "multiplication":
        questionText = `${a} × ${b}`;
        answer = a * b;
        break;
      case "division":
        questionText = `${a * b} ÷ ${b}`;
        answer = a;
        break;
      default:
        questionText = "1 + 1";
        answer = 2;
    }

    setQuestion(questionText);
    setCorrectAnswer(answer);
    setInput("");
    inputRef.current?.focus();
  };

  // First question on mount
  useEffect(() => {
    generateQuestion();
  }, []);

  // Handle answer submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(input) === correctAnswer) {
      setScore((s) => s + 1);
    }
    generateQuestion();
  };

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", position: "relative" }}>
      {/* Timer top-left */}
      <div style={{ position: "absolute", top: "1rem", left: "1rem", fontSize: "1rem" }}>
        Seconds left: {timeLeft}
      </div>

      {/* Score top-right */}
      <div style={{ position: "absolute", top: "1rem", right: "1rem", fontSize: "1rem" }}>
        Score: {score}
      </div>

      {/* Question center */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          fontSize: "2rem",
          fontWeight: "bold",
          backgroundColor: "#e5e7eb", // light gray
        }}
      >
        <label>
          {question} ={" "}
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
            style={{
              fontSize: "2rem",
              padding: "0.25rem",
              width: "100px",
              textAlign: "center",
            }}
          />
        </label>
      </form>
    </div>
  );
}

export default Game;
