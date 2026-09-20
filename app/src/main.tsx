import "./reset.css";
import "./main.css";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import router from "./router.tsx";

const root = document.getElementById("root");

if (!root) {
  throw new Error("root does not exist");
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

createRoot(root).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <RouterProvider router={router} />
    </ConvexAuthProvider>
  </StrictMode>,
);
