import { useNavigate } from "react-router-dom";

function MultiplayerMenu() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f4f8",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ marginBottom: "2rem" }}>Multiplayer</h1>
      <button
        onClick={() => navigate("/create-lobby")}
        style={{
          fontSize: "1.2rem",
          padding: "0.75rem 1.5rem",
          marginBottom: "1rem",
          backgroundColor: "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Create Lobby
      </button>
      <button
        onClick={() => navigate("/join-lobby")}
        style={{
          fontSize: "1.2rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "#6366f1",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Join Lobby
      </button>
    </div>
  );
}

export default MultiplayerMenu;
