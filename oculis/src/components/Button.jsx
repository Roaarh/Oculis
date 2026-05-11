import React from "react";
import styled from "styled-components";

// Accept children, disabled, onClick, style, and any extra props!
const Button = ({ children, disabled, onClick, style, ...props }) => (
  <StyledButton disabled={disabled} onClick={onClick} style={style} {...props}>
    {children}
  </StyledButton>
);

const StyledButton = styled.button`
  margin-top: 18px;
  background: linear-gradient(90deg, #ffffff, #f0f0f0);
  color: #20154a;
  border: none;
  padding: 12px 20px;
  border-radius: 28px;
  font-weight: 600;
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  align-self: center;
  opacity: ${props => (props.disabled ? 0.6 : 1)};
  box-shadow: 0 8px 30px rgba(32, 21, 74, 0.15);
  font-size: 1rem;
  transition: box-shadow 0.2s, background 0.2s;

  &:hover:not(:disabled) {
    background: #eeeeee;
    box-shadow: 0 14px 34px rgba(50, 32, 90, 0.22);
  }
`;

export default Button;
