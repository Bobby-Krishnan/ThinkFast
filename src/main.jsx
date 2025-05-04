import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import MultiplayerMenu from "./MultiplayerMenu.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/multiplayer" element={<MultiplayerMenu />} />
    </Routes>
  </BrowserRouter>
);
