import "./reset.css";
import "./main.css";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { SessionProvider } from "convex-helpers/react/sessions";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import { ErrorBoundary } from "./ErrorBoundary.tsx";
import router from "./router.tsx";

const root = document.getElementById("root");

if (!root) {
  throw new Error("root does not exist");
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <ConvexProvider client={convex}>
        <SessionProvider>
          <RouterProvider router={router} />
        </SessionProvider>
      </ConvexProvider>
    </ErrorBoundary>
  </StrictMode>,
);
