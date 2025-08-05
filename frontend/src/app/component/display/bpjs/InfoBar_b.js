import React, { useState, useEffect } from "react";
import Image from "next/image";

const InfoBar_b = ({location}) => {
  const [time, setTime] = useState(null);
  const [currLoc,setCurrLoc] = useState();
  function assignLocation(location){
    if(location == 'bpjs'){
      setCurrLoc("Lantai 1 BPJS");
    }
    if(location == 'gmcb'){
      setCurrLoc("Lantai 1 GMCB");
    }
    if(location == 'lt3'){
      setCurrLoc("Lantai 3 GMCB");
    }
  }

  
  useEffect(() => {
    const updateClock = () => {
      setTime(new Date());
    };
    const timerId = setInterval(updateClock, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    assignLocation(location);
  },[])

  if (!time) {
    return null;
  }


  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#F0F0F)",
        borderBottom: "2px solid #e0e0e0",
        border: "2px solid #d3d3d3", // Tambahkan border tepi
        borderRadius: "8px", // Opsional: membuat sudut border melengkung
        boxShadow: "0 5px 8px rgba(0, 0, 0, 0.1)", // Tambahkan bayangan
      }}
    >
      {/* Waktu dan Tanggal */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          {time.toLocaleTimeString()}
        </div>
        <div style={{ fontSize: "1.2rem" }}>{time.toLocaleDateString()}</div>
      </div>

      {/* Nama Layanan */}
      <div style={{color:"black", textAlign: "center", fontWeight: "bold", fontSize: "1.8rem" }}>
        Layanan Farmasi <br/>{currLoc}
      </div>

      {/* Logo */}
      <div>
        <Image
  src="/images/logo.png" // ? Access from public
  alt="Logo"
          width={400}
          height={100}
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

export default InfoBar_b;
