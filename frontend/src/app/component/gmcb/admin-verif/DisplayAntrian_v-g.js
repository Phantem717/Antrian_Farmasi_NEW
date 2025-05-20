//src\components\admin\DisplayAntrian.js
import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const DisplayAntrian = ({
  queueNumber = "A-002",
  loketNumber = "Loket 5",
  width = "450px", // Default lebar
  height = "250px", // Default tinggi
  backgroundColor = "#6A30B5", // Default warna latar
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: backgroundColor, // Warna latar belakang dinamis
        color: "#ffffff", // Warna teks putih
        padding: "20px",
        textAlign: "center",
        borderRadius: "10px",
        width: width, // Atur lebar sesuai props
        height: height, // Atur tinggi sesuai props
        display: "flex",
        flexDirection: "column",
        justifyContent: "center", // Pusatkan konten secara vertikal
        alignItems: "center", // Pusatkan konten secara horizontal
        margin: "20px auto", // Box berada di tengah dengan margin atas-bawah
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Tambahkan bayangan
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          marginBottom: "10px",
          fontSize: "1.2rem", // Ukuran font untuk heading
        }}
      >
        Pemanggilan Antrian
      </Typography>
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          marginBottom: "10px",
          fontSize: "2.5rem", // Ukuran font untuk nomor antrian
        }}
      >
        {queueNumber}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: "1.2rem",
          fontWeight: "500", // Tebalkan sedikit teks loket
        }}
      >
        {loketNumber}
      </Typography>
    </Paper>
  );
};

export default DisplayAntrian;
