import { useEffect, useRef, useState } from "react";

function Game({ settings, onGameEnd }) {
  const [timeLeft, setTimeLeft] = useState(settings.duration);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(score); // track latest score for accuracy
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [input, setInput] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  // Update scoreRef when score changes
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  // Run timer once at game start
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onGameEnd(scoreRef.current); // use the latest score
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []); // run only once

  const getRand = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const generateQuestion = () => {
    const ops = Object.keys(settings.operations).filter((op) => settings.operations[op]);
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
        a = getRand(r.minA, r.maxA); // divisor (small)
        b = getRand(r.minB, r.maxB); // quotient (larger)
        text = `${a * b} ÷ ${a}`;
        answer = b;
        break;
      }

      default:
        text = `1 + 1`;
        answer = 2;
    }

    setQuestion(text);
    setCorrectAnswer(answer);
    setInput("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseInt(input) === correctAnswer) {
      setScore((s) => s + 1);
    }
    generateQuestion();
  };

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", position: "relative" }}>
      <div style={{ position: "absolute", top: "1rem", left: "1rem" }}>
        Seconds left: {timeLeft}
      </div>
      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
        Score: {score}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          fontSize: "2rem",
          fontWeight: "bold",
          backgroundColor: "#e5e7eb",
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
              appearance: "textfield",
              MozAppearance: "textfield",
              WebkitAppearance: "none",
            }}
          />
        </label>
      </form>
    </div>
  );
}

export default Game;
