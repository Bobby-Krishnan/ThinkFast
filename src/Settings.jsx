import { useState } from "react";

function Settings({ onStart }) {
  const [operations, setOperations] = useState({
    addition: true,
    subtraction: true,
    multiplication: true,
    division: true,
  });

  const [ranges, setRanges] = useState({
    min: 2,
    max: 12,
  });

  const [duration, setDuration] = useState(120);

  const handleCheckboxChange = (op) => {
    setOperations((prev) => ({ ...prev, [op]: !prev[op] }));
  };

  const handleStart = () => {
    const selectedOps = Object.keys(operations).filter((op) => operations[op]);
    if (selectedOps.length === 0) {
      alert("Please select at least one operation.");
      return;
    }

    if (ranges.min > ranges.max) {
      alert("Min range cannot be greater than max.");
      return;
    }

    onStart({ operations, ranges, duration });
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        width: "100%",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Choose Your Settings</h2>

      <fieldset>
        <legend><strong>Operations:</strong></legend>
        {["addition", "subtraction", "multiplication", "division"].map((op) => (
          <label key={op} style={{ display: "block", marginBottom: "0.5rem" }}>
            <input
              type="checkbox"
              checked={operations[op]}
              onChange={() => handleCheckboxChange(op)}
            />
            {" " + op.charAt(0).toUpperCase() + op.slice(1)}
          </label>
        ))}
      </fieldset>

      <fieldset style={{ marginTop: "1rem" }}>
        <legend><strong>Number Range:</strong></legend>
        <label>
          Min:
          <input
            type="number"
            value={ranges.min}
            onChange={(e) =>
              setRanges((r) => ({ ...r, min: Number(e.target.value) }))
            }
            style={{ marginLeft: "0.5rem", width: "60px" }}
          />
        </label>
        <label style={{ marginLeft: "1rem" }}>
          Max:
          <input
            type="number"
            value={ranges.max}
            onChange={(e) =>
              setRanges((r) => ({ ...r, max: Number(e.target.value) }))
            }
            style={{ marginLeft: "0.5rem", width: "60px" }}
          />
        </label>
      </fieldset>

      <fieldset style={{ marginTop: "1rem" }}>
        <legend><strong>Duration:</strong></legend>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          style={{ padding: "0.25rem", width: "100%" }}
        >
          {[30, 60, 90, 120].map((d) => (
            <option key={d} value={d}>
              {d} seconds
            </option>
          ))}
        </select>
      </fieldset>

      <button
        onClick={handleStart}
        style={{
          marginTop: "1.5rem",
          width: "100%",
          padding: "0.5rem",
          fontSize: "1rem",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Start
      </button>
    </div>
  );
}

export default Settings;
