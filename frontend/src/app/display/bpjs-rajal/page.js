'use client'

import React, { useState, useEffect } from "react";
import QueueCall from '@/app/component/display/bpjs/QueueCall_c';
import ServingQueue from '@/app/component/display/bpjs/ServingQueue_b';
import MissQueue from '@/app/component/display/bpjs/MissQueue_b';
import NextQueue from '@/app/component/display/bpjs/NextQueue_c';
import InfoBar from '@/app/component/display/bpjs/InfoBar_b';
import MarqueeFooter from '@/app/component/display/bpjs/MarqueeFooter_b';
import { getSocket } from "@/app/utils/api/socket";
import responses from "@/app/utils/api/responses";

export default function Display() {
  const [loading, setLoading] = useState(false);
  const [verificationData, setVerificationData] = useState([]);
  const [pickupData, setPickupData] = useState([]);
  const [medicineData, setMedicineData] = useState([]);
  const [loketData, setLoketData] = useState([]);

  const socket = getSocket();

  async function getResponses() {
    setLoading(true);
    try {
      const response = await responses.getAllResponses("Lantai 1 BPJS");
      setVerificationData(response.data.verificationData || []);
      setPickupData(response.data.pickupData || []);
      setMedicineData(response.data.medicineData || []);
      setLoketData(response.data.loketData || []);
    } catch (error) {
      console.error("ERROR GETTING RESPONSES:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Listen to socket events
    socket.on('test_ping2', (message) => {
      console.log("?? Received test_ping:", message);
      socket.emit("test_pong", { message: "? Server is alive!" });
    });

    socket.on('update_status_medicine_type', (payload) => {
      console.log("?? Update medicine status:", payload.message, payload.data);
    });

    // Cleanup
    return () => {
      socket.off('test_ping2');
      socket.off('update_status_medicine_type');
    };
  }, [socket]);

  useEffect(() => {
    getResponses(); // initial fetch

    let isFetching = false;

    const interval = setInterval(() => {
      if (!isFetching) {
        isFetching = true;
        getResponses().finally(() => {
          isFetching = false;
        });
      }
    }, 500000); // refresh setiap 5 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white h-screen min-w-screen flex flex-col">
      {/* Header and content */}
      <div className="flex-1 overflow-auto p-4">
        <InfoBar />
        <div className="flex flex-row gap-4 mb-4 h-[calc(100%-3rem)]">
          <NextQueue lokasi="Lantai 1 BPJS" />
          <QueueCall lokasi="Lantai 1 BPJS" />
        </div>
      </div>

      {/* Footer */}
      <div className="w-full">
        <MarqueeFooter />
      </div>
    </div>
  );
}
