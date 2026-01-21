import React, { useState, useEffect, useCallback } from "react";
import { Box, Button } from "@mui/material";
import PickupAPI from "@/app/utils/api/Pickup";
import PharmacyAPI from "@/app/utils/api/Pharmacy";
import LoketAPI from "@/app/utils/api/Loket";
import Swal from "sweetalert2";
import { getSocket } from "@/app/utils/api/socket";
import DoctorAppointmentAPI from "@/app/utils/api/Doctor_Appoinment";
import WA_API from "@/app/utils/api/WA";

const validStatus = {
  call: "called_pickup_medicine",
  pending: "pending_pickup_medicine",
  complete: "completed_pickup_medicine",
  recall: "recalled_pickup_medicine",
};

const PilihAksiG = ({ location, selectedQueue, selectedQueueIds = [], setSelectedQueueIds, onStatusUpdate, setSelectedQueue2, selectedQueue2, selectedLoket }) => {
  const socket = getSocket();
  const [isCompleteServiceEnabled, setIsCompleteServiceEnabled] = useState(false);
  
  // Define 5 minutes in milliseconds for the stale check
  const CHECK_DURATION_MS = 5 * 60 * 1000; 

  useEffect(() => {
    // Enable 'Complete' button if any selected queue is currently being processed/called/recalled
    const shouldEnable = selectedQueue2.some(queue =>
      queue.status === "pending_pickup_medicine" ||
      queue.status === "called_pickup_medicine" ||
      queue.status === "recalled_pickup_medicine"
    );
    setIsCompleteServiceEnabled(shouldEnable);
  }, [selectedQueue2]);

  // --- NEW: FUNCTION TO CHECK AND FLAG STALE CALLS ---
  const checkAndFlagStaleCalls = async (currentLocation) => {
    try {
        const response = await PickupAPI.getPickupToday(currentLocation);
        const allQueues = response.data;
        const now = new Date().getTime();
        
        const staleCalledQueues = allQueues.filter(item => {
            // Check only items that were called and have a timestamp
            if (item.status === 'called_pickup_medicine' && item.called_pickup_medicine_stamp) {
                const calledTime = new Date(item.called_pickup_medicine_stamp).getTime();
                const timeElapsed = now - calledTime;
                
                // Return true if time elapsed is GREATER than 5 minutes
                return timeElapsed > CHECK_DURATION_MS;
            }
            return false;
        });

        if (staleCalledQueues.length > 0) {
            console.warn(`⚠️ Found ${staleCalledQueues.length} stale called items.`);
            
            const statusToFlag = 'pending_pickup_medicine';

            // Update all stale items to 'pending_pickup_medicine' status
            await Promise.all(
                staleCalledQueues.map(async (queue) => {
                    const updateBody = { status: statusToFlag,  medicine_type: queue.status_medicine,
                };
                    
                    await PharmacyAPI.updatePharmacyTask(queue.NOP, updateBody);
                    await PickupAPI.updatePickupTask(queue.NOP, updateBody);
                })
            );
            
            return { count: staleCalledQueues.length, action: statusToFlag };
        }
        return { count: 0 };

    } catch (error) {
        console.error("Error checking stale calls:", error);
        return { count: -1, error: error.message };
    }
  };
  // ----------------------------------------------------

  // ✅ Fungsi untuk Update Status ke API Pickup & Pharmacy
  const handleStatusUpdate = async (statusType) => {
    
    // 🛑 INTEGRATION: RUN STALE CHECK FIRST
    const staleResult = await checkAndFlagStaleCalls(location);
    
    if (staleResult.count > 0) {
        Swal.fire({
            icon: "info",
            title: "Antrian Diperbarui Otomatis",
            text: `${staleResult.count} antrian yang melewati batas 5 menit telah ditandai sebagai 'Ditunda'.`,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
        });
        // Force refresh the list to show the pending items before processing the user's new action
        socket.emit('update_pickup', { location }); 
        
        // This is a design choice: either return here, or continue with the user's action
        // For simplicity, we continue, assuming the user's new call is more important.
    }
    // ------------------------------------------

    if (!selectedQueue) {
      Swal.fire({
        icon: "warning",
        title: "Pilih antrian terlebih dahulu!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    try {
      const status = validStatus[statusType];
      const newDate = new Date().toISOString(); // Current timestamp

      // Determine the timestamp field to update based on the statusType
      const timestampField = `${statusType}_pickup_medicine_stamp`;
      
      // 1. Update status and timestamp for all selected queues
      await Promise.all(
        selectedQueue2.map(async (queue) => {
          const pharmacyRequestBody = {
            status: status,
            medicine_type: queue.status_medicine,
          };
          
          // Pickup task requires the status AND the timestamp update
          const pickupRequestBody = {
            status: status,
            
            // Dynamically set the timestamp field to the current time
            [timestampField]: newDate, 
          };

          await Promise.all([
            PharmacyAPI.updatePharmacyTask(queue.NOP, pharmacyRequestBody), 
            // Send the timestamp to Pickup Task
            PickupAPI.updatePickupTask(queue.NOP, pickupRequestBody), 
          ]);
        })
      );

      // 2. Handle notifications (only for calling actions)
      if (statusType === "call" || statusType === "recall") {
        
        // Emit socket for display
        const updatedQueues = selectedQueue2.map(queue => ({
          ...queue,
          loket: selectedLoket,
          status: status, // Reflect new status for socket emit
        }));
        
        socket.emit('call_queues_pickup', {
          data: updatedQueues,
          lokasi: "Lantai 1 BPJS" // Use correct location for display
        });
        
        // 3. Send WhatsApp notifications (simplified)
        for (const queue of selectedQueue2) {
          const doctorResponse = await DoctorAppointmentAPI.getAppointmentByNOP(queue.NOP);
          
          const payload = {
            phone_number: doctorResponse.data.phone_number,
            patient_name: doctorResponse.data.patient_name,
            loket: selectedLoket,
            location: location,
            // ... other payload data ...
          };

          // Update latest for display (first queue in selection)
          if (queue === selectedQueue2[0]) {
            socket.emit('update_latest_pickup', {
              message: "Update Pickup",
              data: payload
            });
          }

          await WA_API.sendWAPickup(payload);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      Swal.fire({
        icon: "success",
        title: `Status berhasil diperbarui menjadi ${status.replace("_", " ")}`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      setIsCompleteServiceEnabled(statusType === "call" || statusType === "recall");

      // 4. Force global updates to refresh queue list
      socket.emit('update_pickup', { location });
      socket.emit('update_display', { location });

      setSelectedQueue2([]);
      setSelectedQueueIds([]);
      onStatusUpdate();

    } catch (error) {
      console.error("❌ Error detail:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal memperbarui status!",
        text: error.message || "Terjadi kesalahan saat menghubungi server.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "15px",
        maxWidth: "500px",
        margin: "auto",
        marginTop:"0"
      }}
    >
      {/* ✅ PANGGIL NOMOR */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: selectedQueue ? "#4CAF50" : "#b0bec5",
          color: "#ffffff",
          fontWeight: "bold",
          padding: "15px",
          height: "60px",
          fontSize: "1rem",
        }}
        onClick={() => handleStatusUpdate("call")}
        disabled={!selectedQueue}
      >
        PANGGIL NOMOR
      </Button>

      {/* ✅ PENDING */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: selectedQueue ? "#FF9800" : "#b0bec5",
          color: "#ffffff",
          fontWeight: "bold",
          padding: "10px",
          height: "60px",
          fontSize: "1rem",
        }}
        onClick={() => handleStatusUpdate("pending")}
        disabled={!selectedQueue}
      >
        PENDING
      </Button>

      {/* ✅ SELESAIKAN LAYANAN */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: isCompleteServiceEnabled ? "#D32F2F" : "#b0bec5",
          color: "#ffffff",
          fontWeight: "bold",
          padding: "12px",
          height: "55px",
          fontSize: "0.95rem",
        }}
        onClick={() => handleStatusUpdate("complete")}
        disabled={!isCompleteServiceEnabled}
      >
        SELESAIKAN LAYANAN
      </Button>

      {/* ✅ PANGGIL ULANG */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: selectedQueue ? "#FFD700" : "#b0bec5",
          color: "#000000",
          fontWeight: "bold",
          padding: "12px",
          height: "60px",
          fontSize: "1rem",
          width: "100%",
        }}
        onClick={() => handleStatusUpdate("recall")}
        disabled={!selectedQueue}
      >
        PANGGIL ULANG
      </Button>
    </Box>
  );
};

export default PilihAksiG;
