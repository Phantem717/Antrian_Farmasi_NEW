// src/models/medicineTask.js
const { getDb } = require('../config/db');
const { getCurrentTimestamp } = require('../handler/timeHandler');
const { get } = require('../routes/doctorAppointments');

class MedicineTask {
  /**
   * Membuat record Medicine_Task baru.
   * @param {Object} data - Data Medicine_Task yang akan disimpan.
   */
  static async create(data) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
        INSERT INTO Medicine_Task (
          NOP, Executor, Executor_Names,
          waiting_medicine_stamp, called_medicine_stamp,
          recalled_medicine_stamp, pending_medicine_stamp,
          processed_medicine_stamp, completed_medicine_stamp,
          loket,lokasi
        )
        VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?,?)
      `;
      const [loket] = await conn.execute(`
        SELECT loket_name 
        FROM Loket 
        WHERE status = "active" 
        AND (loket_name = "Loket 1" OR loket_name = "Loket 4") 
        LIMIT 1;
    `);
    const activeLoket = loket[0].loket_name;
        const timestamp = getCurrentTimestamp();
      const values = [
        data.NOP,
        data.Executor || null,
        data.Executor_Names || null,
        timestamp,
        // waiting_medicine_stamp diisi oleh SQL menggunakan NOW()
        data.called_medicine_stamp || null,
        data.recalled_medicine_stamp || null,
        data.pending_medicine_stamp || null,
        data.processed_medicine_stamp || null,
        data.completed_medicine_stamp || null,
        activeLoket || null,
        data.lokasi
      ];
      const [result] = await conn.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

  /**
   * Mengambil record Medicine_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
   */
  static async findByNOP(NOP) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
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
        LEFT JOIN Doctor_Appointments da ON mt.NOP = da.NOP
        LEFT JOIN Pharmacy_Task pt ON mt.NOP = pt.NOP
        WHERE mt.NOP = ?
      `;
      const [rows] = await conn.execute(query, [NOP]);
      return rows[0];
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

  /**
   * Mengambil semua record Medicine_Task.
   */
  static async getAll() {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
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
        LEFT JOIN Doctor_Appointments da ON mt.NOP = da.NOP
         LEFT JOIN Pharmacy_Task pt ON mt.NOP = pt.NOP
         ORDER BY 
    da.queue_number;
      `;
      const [rows] = await conn.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

  static async getMedicineToday(location){
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
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
        LEFT JOIN Doctor_Appointments da ON mt.NOP = da.NOP
        LEFT JOIN Pharmacy_Task pt ON mt.NOP = pt.NOP
        WHERE date(mt.waiting_medicine_stamp) = CURRENT_DATE
AND (pt.status IS NULL OR 
       (pt.status != 'completed_medicine' AND pt.status LIKE 'waiting_medicine'))
       AND mt.lokasi = ?
         ORDER BY 
    da.queue_number;
      `;
      const [rows] = await conn.execute(query,[location]);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }


  
  static async getMedicineByDate(location,date){
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
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
        LEFT JOIN Doctor_Appointments da ON mt.NOP = da.NOP
         LEFT JOIN Pharmacy_Task pt ON mt.NOP = pt.NOP

        WHERE date(mt.waiting_medicine_stamp) = ?
AND (pt.status IS NULL OR 
       (pt.status != 'completed_medicine' AND pt.status LIKE 'waiting_medicine'))
       AND mt.lokasi = ?
         ORDER BY 
    da.queue_number;
      `;
      const values = [date,location]
      const [rows] = await connection.execute(query, values);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }
  /**
   * Memperbarui record Medicine_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
   * @param {Object} data - Data baru untuk update.
   */
  static async update(NOP, data) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
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

        WHERE NOP = ?
      `;
    //   const [loket] = await conn.execute(`
    //     SELECT loket_name 
    //     FROM Loket 
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

        NOP,
      ];
      const [result] = await conn.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

  /**
   * Menghapus record Medicine_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
   */
  static async delete(NOP) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `DELETE FROM Medicine_Task WHERE NOP = ?`;
      const [result] = await conn.execute(query, [NOP]);
      return result;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }
}

module.exports = MedicineTask;
