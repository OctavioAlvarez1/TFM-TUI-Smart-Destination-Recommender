import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
// @ts-ignore — no type declarations for font side-effect import
import "@fontsource/inter";
import "leaflet/dist/leaflet.css";
import App from "./App";

import ThemeProvider from "./theme/ThemeProvider";

createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);