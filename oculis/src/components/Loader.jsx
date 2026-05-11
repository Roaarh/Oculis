// src/components/Loader.jsx
import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <svg width={100} height={100} viewBox="0 0 100 100">
          <defs>
            <mask id="clipping">
              <polygon points="0,0 100,0 100,100 0,100" fill="black" />
              <polygon points="25,25 75,25 50,75" fill="white" />
              <polygon points="50,25 75,75 25,75" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
              <polygon points="35,35 65,35 50,65" fill="white" />
            </mask>
          </defs>
        </svg>
        <div className="box" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader {
    /* spacey, magnetic palette */
    --color-one: #7b5cff;   /* neon violet ring */
    --color-two: #2d8cff;   /* electric blue ring */
    --color-three: #7b5cff55;
    --color-four: #0b061d99;
    --color-five: #2d8cff33;
    --time-animation: 2s;
    --size: 0.45; /* smaller: around sound button + a bit bigger */
    position: relative;
    border-radius: 50%;
    transform: scale(var(--size));
    box-shadow:
      0 0 24px 0 rgba(123, 92, 255, 0.7),
      0 14px 36px 0 rgba(5, 2, 24, 0.9);
    animation: colorize calc(var(--time-animation) * 3) ease-in-out infinite;
  }

  .loader::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    border-radius: 100%;
    border-top: solid 1px var(--color-one);
    border-bottom: solid 1px var(--color-two);
    background: radial-gradient(circle at 30% 0%, var(--color-five), #050215);
    box-shadow:
      inset 0 10px 16px 0 rgba(123, 92, 255, 0.3),
      inset 0 -10px 16px 0 rgba(0, 0, 0, 0.7);
  }

  .loader .box {
    width: 100px;
    height: 100px;
    background: linear-gradient(
      180deg,
      var(--color-one) 25%,
      var(--color-two) 75%
    );
    mask: url(#clipping);
    -webkit-mask: url(#clipping);
  }

  .loader svg {
    position: absolute;
  }

  .loader svg #clipping {
    filter: contrast(18);
    animation: roundness calc(var(--time-animation) / 2) linear infinite;
  }

  .loader svg #clipping polygon {
    filter: blur(6px);
  }

  .loader svg #clipping polygon:nth-child(1) {
    transform-origin: 75% 25%;
    transform: rotate(90deg);
  }

  .loader svg #clipping polygon:nth-child(2) {
    transform-origin: 50% 50%;
    animation: rotation var(--time-animation) linear infinite reverse;
  }

  .loader svg #clipping polygon:nth-child(3) {
    transform-origin: 50% 60%;
    animation: rotation var(--time-animation) linear infinite;
    animation-delay: calc(var(--time-animation) / -3);
  }

  .loader svg #clipping polygon:nth-child(4) {
    transform-origin: 40% 40%;
    animation: rotation var(--time-animation) linear infinite reverse;
  }

  .loader svg #clipping polygon:nth-child(5) {
    transform-origin: 40% 40%;
    animation: rotation var(--time-animation) linear infinite reverse;
    animation-delay: calc(var(--time-animation) / -2);
  }

  .loader svg #clipping polygon:nth-child(6) {
    transform-origin: 60% 40%;
    animation: rotation var(--time-animation) linear infinite;
  }

  .loader svg #clipping polygon:nth-child(7) {
    transform-origin: 60% 40%;
    animation: rotation var(--time-animation) linear infinite;
    animation-delay: calc(var(--time-animation) / -1.5);
  }

  @keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes roundness {
    0%   { filter: contrast(18); }
    20%  { filter: contrast(4); }
    40%  { filter: contrast(4); }
    60%  { filter: contrast(18); }
    100% { filter: contrast(18); }
  }

  @keyframes colorize {
    0%   { filter: hue-rotate(0deg); }
    50%  { filter: hue-rotate(-35deg); }
    100% { filter: hue-rotate(0deg); }
  }
`;

export default Loader;
