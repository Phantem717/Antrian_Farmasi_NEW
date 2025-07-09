"use client";

import {React,useState} from "react";
import { Box, Typography, Button,TextField } from "@mui/material";
import { useRouter } from "next/navigation"; // ✅ Import useRouter untuk navigasi internal
import dynamic from "next/dynamic";
import "antd/dist/reset.css"; // Import CSS Ant Design
import loginAPI from '../utils/api/Login';
import Swal from "sweetalert2";
const Carousel = dynamic(() => import("antd/es/carousel"), { ssr: false });

const LoginPage = () => {
  const router = useRouter(); // ✅ Inisialisasi useRouter
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  async function login(event) {
  event.preventDefault();

  try {
    if (!username || !password) {
      await Swal.fire({
        icon: "error",
        title: "Username dan Password Harus Diisi!",
        showConfirmButton: true,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

        Swal.fire({
      title: "Memproses...",
      html: "Sedang melakukan autentikasi",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    const loginResponse = await loginAPI.checkLogin(username, password);
    
    if (loginResponse) {
      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem("refresh_token", loginResponse.data.refresh_token);
      
      await Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        showConfirmButton: true,
        timerProgressBar: true,
        allowOutsideClick: false,

      });
      
      router.push("/login/location");
    }
    
  } catch (error) {
    console.error("Login error:", error);
    
    // Clear password field on error
    setPassword("");
    
    let errorMessage = "Terjadi Kesalahan Saat Login";
    
    // Handle specific error cases
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = "Username atau Password Salah";
      } else if (error.response.status === 500) {
        errorMessage = "Server Error, Silakan Coba Lagi Nanti";
      }
    }
    
    await Swal.fire({
      icon: "error",
      title: errorMessage,
      showConfirmButton: true,
      timer: 3000,
      timerProgressBar: true,
    });
    
    // Refocus on username field
    document.getElementById("username-field")?.focus();
  }
}

  // ✅ Redirect ke halaman /login/admin-verif
 
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      {/* Left Section dengan Carousel */}
      <Box
        sx={{
          flex: 1.5,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Carousel autoplay>
          <div>
            <Box
              sx={{
                backgroundImage:
                  "url(https://res.cloudinary.com/dk0z4ums3/image/upload/w_667,h_431,c_fill,dpr_2.0/v1558584329/hospital_image/1a7be54b7829_RS%20St.%20Carolus%20-%20Gedung%20All.jpg.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh",
              }}
            ></Box>
          </div>
          <div>
            <Box
              sx={{
                backgroundImage:
                  "url(https://rscarolus.or.id/wp-content/uploads/2023/06/5bc6ac55c67c91539746901.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh",
              }}
            ></Box>
          </div>
        </Carousel>
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "40px",
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src="/images/logo.png"
          alt="Logo St. Carolus"
          sx={{
            maxWidth: "400px",
            marginBottom: "20px",
          }}
        />

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#d32f2f",
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "2rem",
          }}
        >
          Selamat Datang di Aplikasi Antrian Farmasi
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h6"
          sx={{
            color: "#333",
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "1.2rem",
            maxWidth: "350px",
          }}
        >
          Silakan klik <b>MASUK</b> untuk menuju halaman dashboard.
        </Typography>

        <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <TextField 
      label="Username"
      variant="outlined"
      type="text"
      onChange={(e) => setUsername(e.target.value)} 
      value={username}
      style={{ margin: "15px", width: "320px" }}
    />       

    <TextField
      label="Password"
      variant="outlined"
      type="password"
      onChange={(e) => setPassword(e.target.value)}
      value={password}
      style={{ margin: "15px", width: "320px" }}
    />

    <Button
      type="submit"  // Changed to submit type
      variant="contained"
      sx={{
        backgroundColor: "#4caf50",
        color: "#fff",
        fontWeight: "bold",
        padding: "14px 28px",
        borderRadius: "25px",
        width: "320px",
        height: "65px",
        fontSize: "1.3rem",
        transition: "all 0.3s",
        "&:hover": {
          backgroundColor: "#388e3c",
          transform: "scale(1.05)",
        },
      }}
    >
      MASUK
    </Button>
  </form>
      </Box>
    </Box>
  );
};

export default LoginPage;
