import { useEffect, useRef, useState } from "react";

function Game({ settings, onGameEnd }) {
  const [timeLeft, setTimeLeft] = useState(settings.duration);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(score);
  const hasEnded = useRef(false); // prevent double calls
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [input, setInput] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!hasEnded.current) {
            hasEnded.current = true;
            onGameEnd(scoreRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getRand = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const generateQuestion = () => {
    const ops = Object.keys(settings.operations).filter(
      (op) => settings.operations[op]
    );
    const op = ops[Math.floor(Math.random() * ops.length)];

    let a, b, answer, text;

    switch (op) {
      case "addition": {
        const r = settings.ranges.addSub;
        a = getRand(r.minA, r.maxA);
        b = getRand(r.minB, r.maxB);
        text = `${a} + ${b}`;
        answer = a + b;
        break;
      }
      case "subtraction": {
        const r = settings.ranges.addSub;
        a = getRand(r.minA, r.maxA);
        b = getRand(r.minB, r.maxB);
        text = `${a + b} - ${b}`;
        answer = a;
        break;
      }
      case "multiplication": {
        const r = settings.ranges.mulDiv;
        a = getRand(r.minA, r.maxA);
        b = getRand(r.minB, r.maxB);
        text = `${a} × ${b}`;
        answer = a * b;
        break;
      }
      case "division": {
        const r = settings.ranges.mulDiv;
        a = getRand(r.minA, r.maxA);
        b = getRand(r.minB, r.maxB);
        text = `${a * b} ÷ ${a}`;
        answer = b;
        break;
      }
      default:
        text = "1 + 1";
        answer = 2;
    }

    setQuestion(text);
    setCorrectAnswer(answer);
    setInput("");

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  useEffect(() => {
    if (parseInt(input) === correctAnswer) {
      setScore((s) => s + 1);
      generateQuestion();
    }
  }, [input]);

  if (correctAnswer === null) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#f9fafb",
        overflow: "hidden",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "1rem",
          fontWeight: "500",
          color: "#1f2937",
        }}
      >
        <div>Seconds left: {timeLeft}</div>
        <div>Score: {score}</div>
      </div>

      {/* Centered question & input */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          fontSize: "3rem",
          fontWeight: "bold",
        }}
      >
        <label>
          {question} ={" "}
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const numeric = parseInt(input);
                if (numeric !== correctAnswer) {
                  setScore((s) => Math.max(0, s - 1));
                  generateQuestion();
                }
              }
            }}
            ref={inputRef}
            style={{
              fontSize: "2.5rem",
              padding: "0.5rem",
              width: "130px",
              textAlign: "center",
              appearance: "textfield",
              MozAppearance: "textfield",
              WebkitAppearance: "none",
            }}
          />
        </label>
      </div>
    </div>
  );
}

export default Game;
