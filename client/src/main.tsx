import "./reset.css";
import "./main.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

const root = document.getElementById("root");

if (!root) {
  throw new Error("root does not exist");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
