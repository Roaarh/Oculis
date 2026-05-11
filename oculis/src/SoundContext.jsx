// src/SoundContext.jsx
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

const SoundContext = createContext();

const PLAYING_KEY = "oculis_sound_is_playing";

export const SoundProvider = ({ children }) => {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldResume, setShouldResume] = useState(false); // was playing before refresh?

  // Read previous state once
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PLAYING_KEY);
      if (stored === "true") {
        setShouldResume(true); // user had sound ON before
      }
    } catch (e) {
      console.warn("Failed to read sound state:", e);
    }
  }, []);

  // Persist playing state whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(PLAYING_KEY, isPlaying ? "true" : "false");
    } catch (e) {
      console.warn("Failed to store sound state:", e);
    }
  }, [isPlaying]);

  const doPlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = false;
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn("play error", err);
      });
  };

  const playMusic = () => {
    // explicit user click on the sound button
    setShouldResume(false); // they already resumed manually
    doPlay();
  };

  const pauseMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    setShouldResume(false); // they chose to stop
  };

  // After refresh: resume on *first* user click anywhere if it was playing
  useEffect(() => {
    if (!shouldResume) return; // nothing to resume

    const handleFirstClick = () => {
      doPlay();          // allowed now because this click is a gesture [web:218][web:219]
      setShouldResume(false);
      window.removeEventListener("click", handleFirstClick);
    };

    window.addEventListener("click", handleFirstClick, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstClick);
    };
  }, [shouldResume]);

  return (
    <SoundContext.Provider
      value={{ audioRef, isPlaying, playMusic, pauseMusic }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
