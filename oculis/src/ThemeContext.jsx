// src/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const THEME_STYLES = {
  Odius: {
    background: "linear-gradient(135deg, #03005E 0%, #53238D 50%, #2F085E 100%)",
    text: "#fff",
    button: "#E0E7FF",
    buttonText: "#03005E",
     logo: "#dcdcdcff",
    dotColor: "rgba(255, 255, 255, 0.7)",
  },
  MidnightBlue: {
    background: "linear-gradient(135deg, #720026 0%, #3700B3 70%, #720026 100%)",
    text: "#fff",
    button: "#fffefaff",
    buttonText: "#3700B3",
     logo: "#dcdcdcff",
    dotColor: "rgba(255, 255, 255, 0.7)",
  },
  deepGalaxy: {
    background:
      "linear-gradient(135deg, #000000ff 10%, #000000ff 20%, #074d9cff 50%, #000000ff 70%, #074d9cff 95%)",
    text: "#fefefeff",
    button: "#FFFFFF",
    buttonText: "#000000ff",
    logo: "#dcdcdcff",
    dotColor: "rgba(0, 229, 255, 0.7)",
  },
  Space: {
    background:
      "linear-gradient(135deg, #4911b1ff 10%, #000000ff 50%, #000000ff 70%, #452e70ff 100%)",
    text: "#fff",
    button: "#FFFFFF",
    buttonText: "#000000ff",
    logo: "#dcdcdcff",
    dotColor: "rgba(255, 255, 255, 0.7)",
  },
  Ocean: {
    background: "linear-gradient(135deg, #0c67ceff 0%, #FF5858 100%)",
    text: "#fff",
    button: "#00E5FF",
    buttonText: "#000000ff",
    logo: "#dcdcdcff",
    dotColor: "rgba(0, 229, 255, 0.7)",
  },
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("Space"); // Default fallback
  const [loading, setLoading] = useState(true);

  // Load theme from database on mount
  useEffect(() => {
    const loadTheme = async () => {
      const userId = localStorage.getItem("oculis_user_id");
      
      console.log("🎨 ThemeContext: Loading theme for userId:", userId);

      if (!userId) {
        console.log("⚠️ No userId, using default theme");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:4000/api/user/settings?userId=${userId}`);
        const data = await res.json();

        console.log("📦 Theme API response:", data);

        if (data.ok && data.settings && data.settings.theme) {
          const savedTheme = data.settings.theme;
          console.log("✅ Loaded theme from DB:", savedTheme);
          
          // Verify theme exists in THEME_STYLES
          if (THEME_STYLES[savedTheme]) {
            setThemeState(savedTheme);
            console.log("✅ Applied theme:", savedTheme);
          } else {
            console.warn("⚠️ Theme not found in THEME_STYLES:", savedTheme);
          }
        } else {
          console.log("⚠️ No saved theme found, using default");
        }
      } catch (err) {
        console.error("🔴 Failed to load theme:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  const setTheme = (newTheme) => {
    console.log("🎨 Setting theme to:", newTheme);
    setThemeState(newTheme);
  };

  // Don't show loading screen, just use default theme while loading
  return (
    <ThemeContext.Provider value={{ theme, setTheme, THEME_STYLES, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
