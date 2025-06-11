// src/models/verificationTask.js
const { getDb } = require('../config/db');

class logsTask {
  /**
   * Mengambil semua data log lengkap dari berbagai task berdasarkan NOP.
   */
  static async getAll() {
    try {
      const connection = getDb();
      const query = `
        SELECT 
        da.NOP,
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
          vt.completed_verification_stamp,
            TIMESTAMPDIFF(
    MINUTE, 
    vt.completed_verification_stamp, 
    pa.called_pickup_medicine_stamp
  ) AS verification_to_pickup_minutes

        FROM Doctor_Appointments da
        LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
        LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
        LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
        LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
        WHERE pt.status = 'completed_pickup_medicine'
      `;

      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getTotalMedicineType(){
    try {
      const connection = getDb();
      const query = `  
      SELECT 
    da.status_medicine,
    COUNT(DISTINCT da.NOP) as booking_count

FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE pt.status = 'completed_pickup_medicine'
GROUP BY da.status_medicine`;
          const [rows] = await connection.execute(query);
          return rows;
    } catch (error) {
      return error;
    }
   
  }

  static async getAvgServiceTime(){
    try {
      const connection = getDb();
      const query = `SELECT 
    AVG(CASE WHEN da.status_medicine = 'Racikan' 
             THEN TIMESTAMPDIFF(MINUTE, vt.waiting_verification_stamp, pa.completed_pickup_medicine_stamp) 
             ELSE NULL END) AS 'AVG PROCESSING TIME - RACIKAN (MINUTES)',
    AVG(CASE WHEN da.status_medicine != 'Racikan' OR da.status_medicine IS NULL
             THEN TIMESTAMPDIFF(MINUTE, vt.waiting_verification_stamp, pa.completed_pickup_medicine_stamp) 
             ELSE NULL END) AS 'AVG PROCESSING TIME - NON-RACIKAN (MINUTES)'
    
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE pt.status = 'completed_pickup_medicine'
  `;
  
  const [rows] = await connection.execute(query);
  return rows;
    } catch (error) {
      return error;
    }
   

  }

  static async getDataPerHour() {
    try {
      const connection = getDb();


      const query = `SELECT 
      HOUR(completed_pickup_medicine_stamp) AS hour_of_day,
      COUNT(*) AS record_count
  FROM Pickup_Task
  WHERE completed_pickup_medicine_stamp IS NOT NULL
   
  GROUP BY HOUR(completed_pickup_medicine_stamp)
  ORDER BY hour_of_day`;
  const [rows] = await connection.execute(query);
  return rows;
    } catch (error) {
      return error;

    }
   
  }
}

module.exports = logsTask;
