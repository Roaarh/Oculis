// src/components/SoundSwitch.jsx
import React from "react";
import styled from "styled-components";
import { useSound } from "../SoundContext";

const SoundSwitch = ({ style = {} }) => {
  const { isPlaying, playMusic, pauseMusic } = useSound();

  const handleChange = () => {
    if (isPlaying) {
      pauseMusic();   // user mutes
    } else {
      playMusic();    // user unmutes
    }
  };

  return (
    <StyledWrapper style={style}>
      <div>
        <input
          type="checkbox"
          id="checkboxInput"
          checked={!isPlaying}          // checked = muted icon
          onChange={handleChange}
        />
        <label htmlFor="checkboxInput" className="toggleSwitch">
          <div className="speaker">
            {/* speaker icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 75">
              <path
                d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
                style={{
                  stroke: "#ffffffff",
                  strokeWidth: 5,
                  strokeLinejoin: "round",
                  fill: "#fff",
                }}
              />
              <path
                d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6"
                style={{
                  fill: "none",
                  stroke: "#ffffffff",
                  strokeWidth: 5,
                  strokeLinecap: "round",
                }}
              />
            </svg>
          </div>
          <div className="mute-speaker">
            {/* mute icon */}
            <svg viewBox="0 0 75 75" stroke="#fff" strokeWidth={5}>
              <path
                d="m39,14-17,15H6V48H22l17,15z"
                fill="#fff"
                strokeLinejoin="round"
              />
              <path
                d="m49,26 20,24m0-24-20,24"
                fill="#fff"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .toggleSwitch {
    width: 48px;
    height: 48px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.1);
    border: 2px solid transparent(180, 173, 173);
    border-radius: 100%;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease,
      box-shadow 0.3s ease;
    overflow: hidden;
  }

  #checkboxInput {
    display: none;
  }

  .speaker,
  .mute-speaker {
    width: 50%;
    height: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;
  }

  .mute-speaker {
    position: absolute;
    opacity: 0;
  }

  #checkboxInput:checked + .toggleSwitch .speaker {
    opacity: 0;
  }

  #checkboxInput:checked + .toggleSwitch .mute-speaker {
    opacity: 1;
  }

  #checkboxInput:active + .toggleSwitch {
    transform: scale(0.9);
  }

  .toggleSwitch:hover {
    background-color: rgba(189, 189, 189, 0.2);
    border-color: rgba(170, 170, 170, 0.6);
    box-shadow: 0 0 20px rgba(179, 179, 179, 0.3);
  }
`;

export default SoundSwitch;
