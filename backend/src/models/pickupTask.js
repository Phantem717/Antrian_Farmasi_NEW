// src/models/pickupTask.js
const { getDb } = require('../config/db');

class PickupTask {
  /**
   * Membuat record Pickup_Task baru.
   * @param {Object} data - Data Pickup_Task yang akan disimpan.
   */
  static async create(data) {
      let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
      const query = `
        INSERT INTO Pickup_Task (
          NOP, Executor, Executor_Names,
          waiting_pickup_medicine_stamp, called_pickup_medicine_stamp,
          recalled_pickup_medicine_stamp, pending_pickup_medicine_stamp,
          processed_pickup_medicine_stamp, completed_pickup_medicine_stamp,
          loket,
          lokasi
        )
        VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?,?)
      `;
      const [loket] = await pool.execute(`
        SELECT loket_name 
        FROM Loket 
        WHERE status = "active" 
        AND (loket_name = "Loket 3" OR loket_name = "Loket 4") 
        LIMIT 1;
    `);
    const activeLoket = loket[0].loket_name;

      const values = [
        data.NOP,
        data.Executor || null,
        data.Executor_Names || null,
        // waiting_pickup_medicine_stamp diisi oleh SQL dengan NOW()
        data.called_pickup_medicine_stamp || null,
        data.recalled_pickup_medicine_stamp || null,
        data.pending_pickup_medicine_stamp || null,
        data.processed_pickup_medicine_stamp || null,
        data.completed_pickup_medicine_stamp || null,
        activeLoket || null,
        data.lokasi
      ];
      const [result] = await pool.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil record Pickup_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
   */
  static async findByNOP(NOP) {
      let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
      const query = `
        SELECT
          pt.*, 
          da.patient_name,
          da.sep_no,
          da.medical_record_no,
          da.queue_number,
          da.status_medicine,
          ph.status,
          ph.medicine_type
        FROM Pickup_Task pt
          LEFT JOIN Doctor_Appointments da ON pt.NOP = da.NOP
          LEFT JOIN Pharmacy_Task ph ON pt.NOP = ph.NOP
        WHERE pt.NOP = ?
      `;
      const [rows] = await pool.execute(query, [NOP]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil semua record Pickup_Task.
   */
  static async getAll() {
      let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
      const query = `
        SELECT
          pt.*, 
          da.patient_name,
          da.sep_no,
          da.medical_record_no,
          da.queue_number,
          da.status_medicine,
          ph.status,
          ph.medicine_type
        FROM Pickup_Task pt
          LEFT JOIN Doctor_Appointments da ON pt.NOP = da.NOP
          LEFT JOIN Pharmacy_Task ph ON pt.NOP = ph.NOP
          ORDER BY 
    da.queue_number;
      `;
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getPickupToday(){
       let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
      const query = `
        SELECT
          pt.*, 
          da.patient_name,
          da.sep_no,
          da.medical_record_no,
          da.queue_number,
          da.status_medicine,
          ph.status,
          ph.medicine_type
        FROM Pickup_Task pt
          LEFT JOIN Doctor_Appointments da ON pt.NOP = da.NOP
          LEFT JOIN Pharmacy_Task ph ON pt.NOP = ph.NOP
          WHERE date(pt.waiting_pickup_medicine_stamp) = CURRENT_DATE
 AND (ph.status IS NULL OR 
       (ph.status != 'completed_pickup_medicine' AND ph.status LIKE '%pickup%'))
          ORDER BY 
    da.queue_number;
      `;
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

   static async getPickupDisplay(){
      let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
      const query = `
       SELECT
  pt.*, 
  da.patient_name,
  da.sep_no,
  da.medical_record_no,
  da.queue_number,
  da.status_medicine,
  ph.status,
  ph.medicine_type
FROM Pickup_Task pt
  LEFT JOIN Doctor_Appointments da ON pt.NOP = da.NOP
  LEFT JOIN Pharmacy_Task ph ON pt.NOP = ph.NOP
WHERE (date(pt.waiting_pickup_medicine_stamp) = CURRENT_DATE 
   OR date(pt.waiting_pickup_medicine_stamp) = CURRENT_DATE - INTERVAL 1 DAY)
  AND (ph.status IS NULL OR 
       (ph.status != 'completed_pickup_medicine' AND ph.status LIKE '%pickup%'))
ORDER BY 
  da.queue_number;
      `;
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

   static async getPickupByDate(date){
       let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
      const query = `
        SELECT
          pt.*, 
          da.patient_name,
          da.sep_no,
          da.medical_record_no,
          da.queue_number,
          da.status_medicine,
          ph.status,
          ph.medicine_type
        FROM Pickup_Task pt
          LEFT JOIN Doctor_Appointments da ON pt.NOP = da.NOP
          LEFT JOIN Pharmacy_Task ph ON pt.NOP = ph.NOP
          WHERE date(pt.waiting_pickup_medicine_stamp) = ?
           AND (ph.status IS NULL OR 
       (ph.status != 'completed_pickup_medicine' AND ph.status LIKE '%pickup%'))
          ORDER BY 
    da.queue_number;
      `;
      const [rows] = await pool.execute(query,[date]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Memperbarui record Pickup_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
   * @param {Object} data - Data baru untuk update.
   */
  static async update(NOP, data) {
      let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
      const query = `
        UPDATE Pickup_Task
        SET Executor = ?,
            Executor_Names = ?,
            waiting_pickup_medicine_stamp = ?,
            called_pickup_medicine_stamp = ?,
            recalled_pickup_medicine_stamp = ?,
            pending_pickup_medicine_stamp = ?,
            processed_pickup_medicine_stamp = ?,
            completed_pickup_medicine_stamp = ?,
            loket = ?
        WHERE NOP = ?
      `;
      const [loket] = await pool.execute(`
        SELECT loket_name 
        FROM Loket 
        WHERE status = "active" 
        AND (loket_name = "Loket 3" OR loket_name = "Loket 4") 
        LIMIT 1;
    `);
    const activeLoket = loket[0].loket_name;

      const values = [
        data.Executor || null,
        data.Executor_Names || null,
        data.waiting_pickup_medicine_stamp || null,
        data.called_pickup_medicine_stamp || null,
        data.recalled_pickup_medicine_stamp || null,
        data.pending_pickup_medicine_stamp || null,
        data.processed_pickup_medicine_stamp || null,
        data.completed_pickup_medicine_stamp || null,
        activeLoket || null,
        NOP,
      ];
      const [result] = await pool.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus record Pickup_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
   */
  static async delete(NOP) {
     let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
      const query = `DELETE FROM Pickup_Task WHERE NOP = ?`;
      const [result] = await pool.execute(query, [NOP]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PickupTask;
