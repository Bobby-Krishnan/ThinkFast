import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import MultiplayerMenu from "./MultiplayerMenu.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateLobby from "./CreateLobby";
import JoinLobby from "./JoinLobby";
import HostGameLobby from "./HostGameLobby";
import PlayerLobby from "./PlayerLobby";
import MultiplayerGame from "./MultiplayerGame";
import MultiplayerResults from "./MultiplayerResults";







ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/multiplayer" element={<MultiplayerMenu />} />
      <Route path="/create-lobby" element={<CreateLobby />} />
      <Route path="/join-lobby" element={<JoinLobby />} />
      <Route path="/lobby/:lobbyCode/host" element={<HostGameLobby />} />
      <Route path="/lobby/:lobbyCode/player" element={<PlayerLobby />} />
      <Route path="/lobby/:lobbyCode/host/game" element={<MultiplayerGame />} />
      <Route path="/lobby/:lobbyCode/player/game" element={<MultiplayerGame />} />  
      <Route path="/lobby/:lobbyCode/host/results" element={<MultiplayerResults />} />
      <Route path="/lobby/:lobbyCode/player/results" element={<MultiplayerResults />} />
    </Routes>
  </BrowserRouter>
);
