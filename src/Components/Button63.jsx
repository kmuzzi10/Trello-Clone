// Button63.jsx
import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  align-items: center;
  background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
  border: 0;
  border-radius: 8px;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  box-sizing: border-box;
  color: #ffffff;
  display: flex;
  font-family: Phantomsans, sans-serif;
  font-size: 14px; /* Smaller font size */
  justify-content: center;
  line-height: 1em;
  max-width: 80px; /* Smaller max width */
  min-width: 80px; /* Smaller min width */
  padding: 10px 15px; /* Smaller padding */
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  cursor: pointer;
  margin-bottom: 15px;

  &:active,
  &:hover {
    outline: 0;
  }

  @media (min-width: 768px) {
    font-size: 18px; /* Adjusted font size for larger screens */
    min-width: 100px; /* Adjusted min width for larger screens */
  }
`;

const Button63 = ({ onClick, children }) => {
  return <Button onClick={onClick}>{children}</Button>;
};

export default Button63;
