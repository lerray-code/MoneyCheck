import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthProvider";
import { SettingsProvider } from "./context/SettingsProvider";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider>
          <App />
          <Toaster position="top-right" />
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>
);