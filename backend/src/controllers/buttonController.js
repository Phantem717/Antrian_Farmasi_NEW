// src/controllers/buttonController.js
const PharmacyTask = require('../models/pharmacyTask');
const VerificationTask = require('../models/verificationTask');
const { getCurrentTimestamp, convertToJakartaTime } = require('../handler/timeHandler');
// const io = req.app.get('socketio')
class ButtonController {
  /**
   * Mengupdate status pada Pharmacy_Task dan mengupdate field stamp pada Verification_Task
   * berdasarkan status yang dikirimkan.
   *
   * Body request harus mengandung:
   * - booking_id: string atau number (ID task)
   * - status: string (nilai status, misalnya "waiting_verification", "called_verification", "recalled_verification", "pending_verification", "processed_verification", atau "completed_verification")
   * - user_id: string (opsional, akan diset ke null jika tidak ada)
   * - name: string (opsional, akan diset ke null jika tidak ada)
   *
   * Contoh body JSON:
   * {
   *   "booking_id": "941325",
   *   "status": "waiting_verification",
   *   "user_id": "user123",
   *   "name": "John Doe"
   * }
   */
  static async updateStatusMedicineType(req, res) {
    try {
      const { NOP, status, user_id, name } = req.body;
      if (!NOP || !status) {
        return res.status(400).json({ message: 'booking_id dan status wajib diisi.' });
      }
    
      // 1. Update status pada Pharmacy_Task (pertahankan medicine_type yang sudah ada)
      const pharmacyData = await PharmacyTask.findByNOP(NOP);
      if (!pharmacyData) {
        return res.status(404).json({ message: 'Pharmacy Task tidak ditemukan.' });
      }
      
      await PharmacyTask.update(NOP, {
        status: status, // misalnya "waiting_verification"
        medicine_type: pharmacyData.medicine_type,
      });
      
      // 2. Update stamp pada Verification_Task sesuai dengan status yang dikirim
      const verificationData = await VerificationTask.findByNOP(NOP);
      if (!verificationData) {
        return res.status(404).json({ message: 'Verification Task tidak ditemukan.' });
      }
      
      
      // Mapping status ke field stamp yang sesuai
      const stampMapping = {
        waiting_verification: 'waiting_verification_stamp',
        called_verification: 'called_verification_stamp',
        recalled_verification: 'recalled_verification_stamp',
        pending_verification: 'pending_verification_stamp',
        processed_verification: 'processed_verification_stamp',
        completed_verification: 'completed_verification_stamp',
      };
      
      if (!(status in stampMapping)) {
        return res.status(400).json({ 
          message: 'Nilai status tidak valid. Gunakan salah satu: waiting_verification, called_verification, recalled_verification, pending_verification, processed_verification, completed_verification.' 
        });
      }
      
      // Buat objek update dari data Verification_Task yang sudah ada
      const updatedVerificationData = {
        Executor: user_id || null,
        Executor_Names: name || null,
        waiting_verification_stamp: verificationData.waiting_verification_stamp,
        called_verification_stamp: verificationData.called_verification_stamp,
        recalled_verification_stamp: verificationData.recalled_verification_stamp,
        pending_verification_stamp: verificationData.pending_verification_stamp,
        processed_verification_stamp: verificationData.processed_verification_stamp,
        completed_verification_stamp: verificationData.completed_verification_stamp,
      };
      
      // Update stamp sesuai status yang dikirim
      const stampField = stampMapping[status];
      updatedVerificationData[stampField] = getCurrentTimestamp();
      
      await VerificationTask.update(NOP, updatedVerificationData);
      const io = req.app.get('socketio');

      io.on('send_queues', (selectedQueue2) => {
        console.log("ON",selectedQueue2);
        io.emit('FB_send_queues',{
          data: selectedQueue2,
        })
      });

      if(status == "called_verification" || status == "recalled_verification" || status == "called_pickup_medicine" || status == "recalled_pickup_medicine"){
        io.emit('update_status_medicine_type', {
          message: "Update Status Medicine Type Succesful",
          data: verificationData,
          NOP: NOP,
        });
      }
      
      return res.status(200).json({ message: 'Status dan stamp berhasil diupdate.' });
      
    } catch (error) {
      console.error("Error in updateStatusMedicineType:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}

module.exports = ButtonController;
