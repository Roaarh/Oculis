// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./ThemeContext";
import { SoundProvider } from "./SoundContext";
import BackgroundMusic from "./components/BackgroundMusic";

ReactDOM.createRoot(document.getElementById("root")).render(
 
    <ThemeProvider>
      <BrowserRouter>
        <SoundProvider>
          <BackgroundMusic />
          <App />
        </SoundProvider>
      </BrowserRouter>
    </ThemeProvider>
 
);
