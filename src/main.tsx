import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { initGA } from "./utils/analytics";
import "katex/dist/katex.min.css";
import "./styles/globals.css";

initGA();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>
);
