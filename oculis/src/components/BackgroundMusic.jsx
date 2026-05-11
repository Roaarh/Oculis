import React from "react";
import { useSound } from "../SoundContext";

const BackgroundMusic = () => {
  const { audioRef } = useSound();

  return (
    <audio
      ref={audioRef}
      src="/music/music.mp3"   // now in public/music/music.mp3
      loop
    />
  );
};

export default BackgroundMusic;


