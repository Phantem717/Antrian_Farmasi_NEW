// src/models/medicineTask.js
const { getDb } = require('../config/db');

class MedicineTask {
  /**
   * Membuat record Medicine_Task baru.
   * @param {Object} data - Data Medicine_Task yang akan disimpan.
   */
  static async create(data) {
    try {
      const connection = getDb();
      const query = `
        INSERT INTO Medicine_Task (
          booking_id, Executor, Executor_Names,
          waiting_medicine_stamp, called_medicine_stamp,
          recalled_medicine_stamp, pending_medicine_stamp,
          processed_medicine_stamp, completed_medicine_stamp,
          loket,lokasi
        )
        VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?,?)
      `;
      const [loket] = await connection.execute(`
        SELECT loket_name 
        FROM loket 
        WHERE status = "active" 
        AND (loket_name = "Loket 3" OR loket_name = "Loket 4") 
        LIMIT 1;
    `);
    const activeLoket = loket[0].loket_name;

      const values = [
        data.booking_id,
        data.Executor || null,
        data.Executor_Names || null,
        // waiting_medicine_stamp diisi oleh SQL menggunakan NOW()
        data.called_medicine_stamp || null,
        data.recalled_medicine_stamp || null,
        data.pending_medicine_stamp || null,
        data.processed_medicine_stamp || null,
        data.completed_medicine_stamp || null,
        activeLoket || null,
        data.lokasi
      ];
      const [result] = await connection.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil record Medicine_Task berdasarkan booking_id.
   * @param {number} booking_id - ID task.
   */
  static async findById(booking_id) {
    try {
      const connection = getDb();
      const query = `
        SELECT
          mt.*, 
          da.patient_name,
          da.sep_no,
          da.medical_record_no,
          da.queue_number,
          da.status_medicine,
          pt.status,
          pt.medicine_type
        FROM Medicine_Task mt
        LEFT JOIN Doctor_Appointments da ON mt.booking_id = da.booking_id
        LEFT JOIN Pharmacy_Task pt ON mt.booking_id = pt.booking_id
        WHERE mt.booking_id = ?
      `;
      const [rows] = await connection.execute(query, [booking_id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil semua record Medicine_Task.
   */
  static async getAll() {
    try {
      const connection = getDb();
      const query = `
        SELECT
          mt.*, 
          da.patient_name,
          da.sep_no,
          da.medical_record_no,
          da.queue_number,
          da.status_medicine,
          pt.status,
          pt.medicine_type
        FROM Medicine_Task mt
        LEFT JOIN Doctor_Appointments da ON mt.booking_id = da.booking_id
        LEFT JOIN Pharmacy_Task pt ON mt.booking_id = pt.booking_id
      `;
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Memperbarui record Medicine_Task berdasarkan booking_id.
   * @param {number} booking_id - ID task.
   * @param {Object} data - Data baru untuk update.
   */
  static async update(booking_id, data) {
    try {
      const connection = getDb();
      const query = `
        UPDATE Medicine_Task
        SET Executor = ?,
            Executor_Names = ?,
            waiting_medicine_stamp = ?,
            called_medicine_stamp = ?,
            recalled_medicine_stamp = ?,
            pending_medicine_stamp = ?,
            processed_medicine_stamp = ?,
            completed_medicine_stamp = ?,
          loket = ?

        WHERE booking_id = ?
      `;
    //   const [loket] = await connection.execute(`
    //     SELECT loket_name 
    //     FROM loket 
    //     WHERE status = "active" 
    //     AND (loket_name = "Loket 3" OR loket_name = "Loket 4") 
    //     LIMIT 1;
    // `);
    // const activeLoket = loket[0].loket_name;

      const values = [
        data.Executor || null,
        data.Executor_Names || null,
        data.waiting_medicine_stamp || null,
        data.called_medicine_stamp || null,
        data.recalled_medicine_stamp || null,
        data.pending_medicine_stamp || null,
        data.processed_medicine_stamp || null,
        data.completed_medicine_stamp || null,
        data.loket || null,
        // data.status || null,

        booking_id,
      ];
      const [result] = await connection.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus record Medicine_Task berdasarkan booking_id.
   * @param {number} booking_id - ID task.
   */
  static async delete(booking_id) {
    try {
      const connection = getDb();
      const query = `DELETE FROM Medicine_Task WHERE booking_id = ?`;
      const [result] = await connection.execute(query, [booking_id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MedicineTask;
