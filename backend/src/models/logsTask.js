// src/models/verificationTask.js
const { getDb } = require('../config/db');

class logsTask {
  /**
   * Mengambil semua data log lengkap dari berbagai task berdasarkan booking_id.
   */
  static async getAll() {
    try {
      const connection = getDb();
      const query = `
        SELECT 
        da.booking_id,
          da.patient_name,
          da.sep_no,
          da.medical_record_no,
          da.status_medicine,
          pa.waiting_pickup_medicine_stamp,
          pa.called_pickup_medicine_stamp,
          pa.recalled_pickup_medicine_stamp,
          pa.pending_pickup_medicine_stamp,
          pa.completed_pickup_medicine_stamp,
          pt.status,
          mt.waiting_medicine_stamp,
          mt.completed_medicine_stamp,
          vt.waiting_verification_stamp,
          vt.called_verification_stamp,
          vt.recalled_verification_stamp,
          vt.pending_verification_stamp,
                    vt.processed_verification_stamp,

          vt.completed_verification_stamp
        FROM Doctor_Appointments da
        LEFT JOIN Verification_Task vt ON da.booking_id = vt.booking_id
        LEFT JOIN Pharmacy_Task pt ON da.booking_id = pt.booking_id
        LEFT JOIN Medicine_Task mt ON da.booking_id = mt.booking_id
        LEFT JOIN Pickup_Task pa ON da.booking_id = pa.booking_id
        WHERE pt.status = 'completed_pickup_medicine'
      `;

      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = logsTask;
