import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/system';

const MovingContainer = styled("div")({
  width: "100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
  position: "relative",
  background: "#f5f5f5",
  padding: "10px 0",
});

const MovingTextStyled = styled(Typography)({
  display: "inline-block",
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: "green",
  padding: "5px 20px",
  animation: "marquee 15s linear infinite",
  "@keyframes marquee": {
    "0%": { transform: "translateX(100%)" },
    "100%": { transform: "translateX(-100%)" }
  },
});

export default function MovingText({ greeting = "Selamat datang di Aplikasi Antrian Farmasi BPJS, Salam Sehat 🙏🏼", username }) {
  return (
    <MovingContainer>
      <MovingTextStyled>
        {greeting} {username ? username.toUpperCase() : ""}
      </MovingTextStyled>
    </MovingContainer>
  );
}
