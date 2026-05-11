import React from "react";
import { useTheme } from "../ThemeContext";
import "../styles/themes.css";

export default function ThemeSelector({ onThemeChange }) {
  const { theme, setTheme, THEME_STYLES } = useTheme();

  const themes = [
    { id: "Odius" },
    { id: "Space" },
    { id: "MidnightBlue" },
    { id: "deepGalaxy" },
    { id: "Ocean" },
  ];

  const handleThemeClick = async (themeId) => {
    console.log("🎨 Theme clicked:", themeId);
    
    // Update local theme immediately
    setTheme(themeId);

    // Call the parent callback to save to database
    if (onThemeChange) {
      console.log("📤 Calling onThemeChange callback");
      onThemeChange(themeId);
    }
  };

  return (
    <div className="theme-row">
      {themes.map((t) => (
        <button
          key={t.id}
          className={`theme-circle ${theme === t.id ? "selected" : ""}`}
          style={{ background: THEME_STYLES[t.id].background }}
          onClick={() => handleThemeClick(t.id)}
          data-name={t.id}
          title={t.id}
        />
      ))}
    </div>
  );
}
