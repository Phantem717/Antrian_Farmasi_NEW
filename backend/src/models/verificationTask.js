// src/models/verificationTask.js
const { getDb } = require('../config/db');

class VerificationTask {
  /**
   * Membuat record Verification_Task baru.
   * @param {Object} data - Data Verification_Task yang akan disimpan.
   *        Data diharapkan berisi:
   *          - booking_id
   *          - Executor (opsional)
   *          - Executor_Names (opsional)
   *          - called_verification_stamp (opsional, dengan format MySQL TIMESTAMP)
   *          - recalled_verification_stamp (opsional)
   *          - pending_verification_stamp (opsional)
   *          - processed_verification_stamp (opsional)
   *          - completed_verification_stamp (opsional)
   * @returns {Promise<Object>} - Hasil query.
   */
  static async create(data) {
    try {
      const connection = getDb();
      const query = `
        INSERT INTO Verification_Task (
          booking_id, Executor, Executor_Names,
          waiting_verification_stamp, called_verification_stamp,
          recalled_verification_stamp, pending_verification_stamp,
          processed_verification_stamp, completed_verification_stamp,
          loket,lokasi
        )
        VALUES (?, ?, ?, NOW(),? , ?, ?, ?, ?, ?,?)
      `;
      const [loket] = await connection.execute(`
        SELECT loket_name 
        FROM loket 
        WHERE status = "active" 
        AND (loket_name = "Loket 1" OR loket_name = "Loket 2") 
        LIMIT 1;
    `);
    const activeLoket = loket[0].loket_name;
      const values = [
        data.booking_id,
        data.Executor || null,
        data.Executor_Names || null,
        // waiting_verification_stamp di-set otomatis menggunakan NOW()
        data.called_verification_stamp || null,
        data.recalled_verification_stamp || null,
        data.pending_verification_stamp || null,
        data.processed_verification_stamp || null,
        data.completed_verification_stamp || null,
        activeLoket || null,
        data.lokasi || null
      ];
      const [result] = await connection.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil record Verification_Task berdasarkan booking_id.
   * @param {number} booking_id - ID task.
   * @returns {Promise<Object>} - Record Verification_Task.
   */
  static async findById(booking_id) {
    try {
      const connection = getDb();
      const query = `
        SELECT 
          vt.*, 
          da.patient_name,
          da.sep_no,
          da.medical_record_no,
          da.queue_number,
          da.status_medicine,
          pt.status,
          pt.medicine_type,
          mt.loket as 'loket2'
        FROM Verification_Task vt
        LEFT JOIN Doctor_Appointments da ON vt.booking_id = da.booking_id
        LEFT JOIN Pharmacy_Task pt ON vt.booking_id = pt.booking_id
        LEFT JOIN Medicine_Task mt ON vt.booking_id = mt.booking_id
        WHERE vt.booking_id = ?
      `;
      const [rows] = await connection.execute(query, [booking_id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil semua record Verification_Task.
   * @returns {Promise<Array>} - Array dari semua record Verification_Task.
   */
  static async getAll() {
    try {
      const connection = getDb();
      const query = `
        SELECT 
          vt.*, 
          da.patient_name,
          da.sep_no,
          da.medical_record_no,
          da.queue_number,
          da.status_medicine,
          pt.status,
          pt.medicine_type
        FROM Verification_Task vt
        LEFT JOIN Doctor_Appointments da ON vt.booking_id = da.booking_id
        LEFT JOIN Pharmacy_Task pt ON vt.booking_id = pt.booking_id
      `;

      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Memperbarui record Verification_Task berdasarkan booking_id.
   * @param {number} booking_id - ID task.
   * @param {Object} data - Data baru untuk update.
   *        Data diharapkan berisi:
   *          - Executor (opsional)
   *          - Executor_Names (opsional)
   *          - called_verification_stamp (opsional)
   *          - recalled_verification_stamp (opsional)
   *          - pending_verification_stamp (opsional)
   *          - processed_verification_stamp (opsional)
   *          - completed_verification_stamp (opsional)
   * @returns {Promise<Object>} - Hasil query update.
   */
  static async update(booking_id, data) {
    try {
      const connection = getDb();
      const query = `
        UPDATE Verification_Task
        SET Executor = ?,
            Executor_Names = ?,
            waiting_verification_stamp = ?,
            called_verification_stamp = ?,
            recalled_verification_stamp = ?,
            pending_verification_stamp = ?,
            processed_verification_stamp = ?,
            completed_verification_stamp = ?,
            loket = ?
        WHERE booking_id = ?
      `;
      const [loket] = await connection.execute(`
        SELECT loket_name 
        FROM loket 
        WHERE status = "active" 
        AND (loket_name = "Loket 1" OR loket_name = "Loket 2") 
        LIMIT 1;
    `);
    const activeLoket = loket[0].loket_name;
      const values = [
        data.Executor || null,
        data.Executor_Names || null,
        data.waiting_verification_stamp,  // tidak menggunakan NOW()
        data.called_verification_stamp || null,
        data.recalled_verification_stamp || null,
        data.pending_verification_stamp || null,
        data.processed_verification_stamp || null,
        data.completed_verification_stamp || null,
        activeLoket || null,
        booking_id,
      ];
      const [result] = await connection.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus record Verification_Task berdasarkan booking_id.
   * @param {number} booking_id - ID task.
   * @returns {Promise<Object>} - Hasil query delete.
   */
  static async delete(booking_id) {
    try {
      const connection = getDb();
      const query = `DELETE FROM Verification_Task WHERE booking_id = ?`;
      const [result] = await connection.execute(query, [booking_id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = VerificationTask;
