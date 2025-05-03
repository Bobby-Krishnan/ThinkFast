import { useState } from "react";

function Settings({ onStart }) {
  const [operations, setOperations] = useState({
    addition: true,
    subtraction: true,
    multiplication: true,
    division: true,
  });

  const [ranges, setRanges] = useState({
    addSub: { minA: 2, maxA: 100, minB: 2, maxB: 100 },
    mulDiv: { minA: 2, maxA: 12, minB: 2, maxB: 100 },
  });

  const [duration, setDuration] = useState(120);

  const handleCheckboxChange = (op) => {
    setOperations((prev) => ({ ...prev, [op]: !prev[op] }));
  };

  const handleRangeChange = (group, field, value) => {
    setRanges((prev) => ({
      ...prev,
      [group]: { ...prev[group], [field]: Number(value) },
    }));
  };

  const handleStart = () => {
    const selectedOps = Object.keys(operations).filter((op) => operations[op]);
    if (selectedOps.length === 0) {
      alert("Please select at least one operation.");
      return;
    }

    onStart({ operations, ranges, duration });
  };

  const inputStyle = {
    width: "50px",
    margin: "0 4px",
    padding: "2px 4px",
    fontSize: "0.9rem",
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "600px",
        width: "100%",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Choose Your Settings</h2>

      {/* Operation Checkboxes */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
        {["addition", "subtraction", "multiplication", "division"].map((op) => (
          <label key={op} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={operations[op]}
              onChange={() => handleCheckboxChange(op)}
            />
            <strong style={{ textTransform: "capitalize" }}>{op}</strong>
          </label>
        ))}
      </div>

      {/* Addition & Subtraction Range */}
      <fieldset style={{ marginBottom: "1rem", border: "none" }}>
        <legend style={{ fontWeight: "bold", fontSize: "1rem" }}>Addition / Subtraction Range</legend>
        <div style={{ fontSize: "0.95rem" }}>
          Range: (
          <input
            type="number"
            value={ranges.addSub.minA}
            onChange={(e) => handleRangeChange("addSub", "minA", e.target.value)}
            style={inputStyle}
          />
          to
          <input
            type="number"
            value={ranges.addSub.maxA}
            onChange={(e) => handleRangeChange("addSub", "maxA", e.target.value)}
            style={inputStyle}
          />
          ) + (
          <input
            type="number"
            value={ranges.addSub.minB}
            onChange={(e) => handleRangeChange("addSub", "minB", e.target.value)}
            style={inputStyle}
          />
          to
          <input
            type="number"
            value={ranges.addSub.maxB}
            onChange={(e) => handleRangeChange("addSub", "maxB", e.target.value)}
            style={inputStyle}
          />
          )
        </div>
      </fieldset>

      {/* Multiplication & Division Range */}
      <fieldset style={{ marginBottom: "1rem", border: "none" }}>
        <legend style={{ fontWeight: "bold", fontSize: "1rem" }}>Multiplication / Division Range</legend>
        <div style={{ fontSize: "0.95rem" }}>
          Range: (
          <input
            type="number"
            value={ranges.mulDiv.minA}
            onChange={(e) => handleRangeChange("mulDiv", "minA", e.target.value)}
            style={inputStyle}
          />
          to
          <input
            type="number"
            value={ranges.mulDiv.maxA}
            onChange={(e) => handleRangeChange("mulDiv", "maxA", e.target.value)}
            style={inputStyle}
          />
          ) × (
          <input
            type="number"
            value={ranges.mulDiv.minB}
            onChange={(e) => handleRangeChange("mulDiv", "minB", e.target.value)}
            style={inputStyle}
          />
          to
          <input
            type="number"
            value={ranges.mulDiv.maxB}
            onChange={(e) => handleRangeChange("mulDiv", "maxB", e.target.value)}
            style={inputStyle}
          />
          )
        </div>
      </fieldset>

      {/* Duration */}
      <fieldset style={{ marginTop: "1rem", border: "none" }}>
        <legend>
          <strong>Duration:</strong>
        </legend>
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
          backgroundColor: "#3b82f6",
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
