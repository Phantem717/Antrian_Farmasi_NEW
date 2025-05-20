//frontend\src\app\component\display\MarqueeFooter.js
import React, { useEffect, useState } from "react";

const MarqueeFooter = () => {
  const [messages, setMessages] = useState([
    "Selamat datang, silahkan menunggu panggilan antrian. Terima Kasih.",
    "@Display Farmasi 2024 - SIRS Developer Team"
  ]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const storedMessages = localStorage.getItem("marqueeMessages");
    let parsedMessages = [
      "Selamat datang, silahkan menunggu panggilan antrian. Terima Kasih.",
      "@Display Farmasi 2024 - SIRS Developer Team"
    ];
  
    if (storedMessages) {
      try {
        parsedMessages = JSON.parse(storedMessages);
      } catch (error) {
        console.error("Gagal membaca marqueeMessages dari localStorage:", error);
      }
    }
  
    setMessages(parsedMessages);
  
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % parsedMessages.length);
    }, 15000);
  
    return () => clearInterval(interval);
  }, []);
  

  return (
    <footer className="bg-blue-700 text-white p-2 mt-4">
      <marquee behavior="scroll" direction="left" className="font-bold text-1xl">
        {messages[currentMessageIndex]}
      </marquee>
    </footer>
  );
};

export default MarqueeFooter;
