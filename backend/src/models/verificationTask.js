// src/models/verificationTask.js
const { getDb } = require('../config/db');

class VerificationTask {
  /**
   * Membuat record Verification_Task baru.
   * @param {Object} data - Data Verification_Task yang akan disimpan.
   *        Data diharapkan berisi:
   *          - NOP
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
      let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
      const query = `
        INSERT INTO Verification_Task (
          NOP, Executor, Executor_Names,
          waiting_verification_stamp, called_verification_stamp,
          recalled_verification_stamp, pending_verification_stamp,
          processed_verification_stamp, completed_verification_stamp,
          loket,lokasi
        )
        VALUES (?, ?, ?, NOW(),? , ?, ?, ?, ?, ?,?)
      `;
      const [loket] = await connection.execute(`
        SELECT loket_name 
        FROM Loket 
        WHERE status = "active" 
        AND (loket_name = "Loket 1" OR loket_name = "Loket 2") 
        LIMIT 1;
    `);
    const activeLoket = loket[0].loket_name;
      const values = [
        data.NOP,
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
   * Mengambil record Verification_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
   * @returns {Promise<Object>} - Record Verification_Task.
   */
  static async findByNOP(NOP) {
      let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
      const query = `
        SELECT 
          vt.*, 
          da.patient_name,
          da.sep_no,
          da.medical_record_no,
          da.queue_number,
                    da.farmasi_queue_number,
          da.phone_number,

          da.status_medicine,
          da.patient_date_of_birth,
          pt.status,
          pt.medicine_type,
          mt.loket as 'loket2'
        FROM Verification_Task vt
        LEFT JOIN Doctor_Appointments da ON vt.NOP = da.NOP
        LEFT JOIN Pharmacy_Task pt ON vt.NOP = pt.NOP
        LEFT JOIN Medicine_Task mt ON vt.NOP = mt.NOP
        WHERE vt.NOP = ?
      `;
      const [rows] = await connection.execute(query, [NOP]);
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
      let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
      const query = `
       SELECT 
  vt.*, 
  da.patient_name,
  da.sep_no,
  da.medical_record_no,
  da.queue_number,
  da.farmasi_queue_number,
  da.patient_date_of_birth,
  da.status_medicine,
  da.phone_number,
  pt.status,
  pt.medicine_type
FROM Verification_Task vt
LEFT JOIN Doctor_Appointments da ON vt.NOP = da.NOP
LEFT JOIN Pharmacy_Task pt ON vt.NOP = pt.NOP
WHERE (da.queue_number LIKE 'RC%' OR da.queue_number LIKE 'NR%') AND DATE(vt.waiting_verification_stamp) = CURRENT_DATE
ORDER BY vt.waiting_verification_stamp ASC;
      `;

      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getToday(){
      let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
      const query = `
     SELECT 
  vt.*, 
  da.patient_name,
  da.sep_no,
  da.medical_record_no,
  da.queue_number,
  da.farmasi_queue_number,
  da.patient_date_of_birth,
  da.status_medicine,
  da.phone_number,
  pt.status,
  pt.medicine_type
FROM Verification_Task vt
LEFT JOIN Doctor_Appointments da ON vt.NOP = da.NOP
LEFT JOIN Pharmacy_Task pt ON vt.NOP = pt.NOP
WHERE (da.queue_number LIKE 'RC%' OR da.queue_number LIKE 'NR%') 
  AND DATE(vt.waiting_verification_stamp) = CURRENT_DATE
  AND (pt.status IS NULL OR 
       (pt.status != 'completed_verification' AND pt.status LIKE '%verification%'))
ORDER BY vt.waiting_verification_stamp ASC;
      `;

      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  
  static async getByDate(date){
       let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
      const query = `
       SELECT 
  vt.*, 
  da.patient_name,
  da.sep_no,
  da.medical_record_no,
  da.queue_number,
  da.farmasi_queue_number,
  da.patient_date_of_birth,
  da.status_medicine,
  da.phone_number,
  pt.status,
  pt.medicine_type
FROM Verification_Task vt
LEFT JOIN Doctor_Appointments da ON vt.NOP = da.NOP
LEFT JOIN Pharmacy_Task pt ON vt.NOP = pt.NOP
WHERE (da.queue_number LIKE 'RC%' OR da.queue_number LIKE 'NR%')
  AND DATE(vt.waiting_verification_stamp) = ?
  AND vt.waiting_verification_stamp IS NOT NULL
  AND (pt.status IS NULL OR 
       (pt.status != 'completed_verification' AND pt.status LIKE '%verification%'))
ORDER BY vt.waiting_verification_stamp ASC;
      `;

      const [rows] = await connection.execute(query, [date]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Memperbarui record Verification_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
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
  static async update(NOP, data) {
      let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
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
        WHERE NOP = ?
      `;
      const [loket] = await connection.execute(`
        SELECT loket_name 
        FROM Loket 
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
        NOP,
      ];
      const [result] = await connection.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus record Verification_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
   * @returns {Promise<Object>} - Hasil query delete.
   */
  static async delete(NOP) {
     let connection;

    try {
      const pool = getDb();
      connection = await pool.getConnection();
      const query = `DELETE FROM Verification_Task WHERE NOP = ?`;
      const [result] = await connection.execute(query, [NOP]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = VerificationTask;
