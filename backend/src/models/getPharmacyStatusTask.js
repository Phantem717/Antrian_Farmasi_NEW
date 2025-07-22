// src/models/doctorAppointments.js
const { getDb } = require('../config/db');

class getPharmacyTasks {
  /**
   * Membuat record appointment baru.
   * @param {Object} NOP - Data appointment yang akan disimpan.
   */
  static async getByNOP(NOP) {

    try {
      const pool = await getDb();     
      const query = `
     SELECT 
  da.patient_name,
  da.NOP,
  da.sep_no,
  da.queue_number,
  da.status_medicine,
  pa.status,
  vt.waiting_verification_stamp,
  vt.completed_verification_stamp,
  md.waiting_medicine_stamp,
  md.completed_medicine_stamp,
  pt.waiting_pickup_medicine_stamp,
  pt.completed_pickup_medicine_stamp,
  pt.called_pickup_medicine_stamp,
  pt.pending_pickup_medicine_stamp

FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pa ON da.NOP = pa.NOP
LEFT JOIN Medicine_Task md ON da.NOP = md.NOP
LEFT JOIN Pickup_Task pt ON da.NOP = pt.NOP

WHERE da.NOP =?
`;
      const [rows] = await pool.execute(query, [NOP]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

/**
   * Membuat record appointment baru.
   * @param {Object} SEP - Data appointment yang akan disimpan.
   */
  static async getBySEP(SEP) {

    try {
      const pool = await getDb();    
      const query = `
     SELECT 
  da.patient_name,
  da.NOP,
  da.sep_no,
  da.queue_number,
  da.status_medicine,
  pa.status,
  vt.waiting_verification_stamp,
  vt.completed_verification_stamp,
  md.waiting_medicine_stamp,
  md.completed_medicine_stamp,
  pt.waiting_pickup_medicine_stamp,
  pt.completed_pickup_medicine_stamp,
  pt.called_pickup_medicine_stamp,
  pt.pending_pickup_medicine_stamp

FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pa ON da.NOP = pa.NOP
LEFT JOIN Medicine_Task md ON da.NOP = md.NOP
LEFT JOIN Pickup_Task pt ON da.NOP = pt.NOP

WHERE da.sep_no =?
`;
      const [rows] = await pool.execute(query, [SEP]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  


}

module.exports = getPharmacyTasks;
