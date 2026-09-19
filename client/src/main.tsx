import "./reset.css";
import "./main.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { SpacetimeDBProvider } from "spacetimedb/react";

import { DbConnection } from "./module_bindings/index.ts";
import router from "./router.tsx";

// TODO: Eventually use an environment variable
const HOST = "ws://localhost:3000";
const DB_NAME = "bananagrams";
const TOKEN_KEY = `${HOST}/${DB_NAME}/auth_token`;

const root = document.getElementById("root");

if (!root) {
  throw new Error("root does not exist");
}

const connectionBuilder = DbConnection.builder()
  .withUri(HOST)
  .withDatabaseName(DB_NAME)
  .withToken(localStorage.getItem(TOKEN_KEY) ?? undefined)
  .onConnect((_connection, _identity, token) => {
    localStorage.setItem(TOKEN_KEY, token);
  });

createRoot(root).render(
  <StrictMode>
    <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
      <RouterProvider router={router} />
    </SpacetimeDBProvider>
  </StrictMode>,
);
