// src/models/pickupTask.js
const { getDb } = require('../config/db');
const { getCurrentTimestamp } = require('../handler/timeHandler')

class PickupTask {
  /**
   * Membuat record Pickup_Task baru.
   * @param {Object} data - Data Pickup_Task yang akan disimpan.
   */
  static async create(data) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
        INSERT INTO Pickup_Task (
          NOP, Executor, Executor_Names,
          waiting_pickup_medicine_stamp, called_pickup_medicine_stamp,
          recalled_pickup_medicine_stamp, pending_pickup_medicine_stamp,
          processed_pickup_medicine_stamp, completed_pickup_medicine_stamp,
          loket,
          lokasi
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
      `;
      const [loket] = await conn.execute(`
        SELECT loket_name 
        FROM Loket 
        WHERE status = "active" 
        AND (loket_name = "Loket 3" OR loket_name = "Loket 4") 
        LIMIT 1;
    `);
    const activeLoket = loket[0].loket_name;
        const timestamp = getCurrentTimestamp();
      const values = [
        data.NOP,
        data.Executor || null,
        data.Executor_Names || null,
        timestamp,
        // waiting_pickup_medicine_stamp diisi oleh SQL dengan NOW()
        data.called_pickup_medicine_stamp || null,
        data.recalled_pickup_medicine_stamp || null,
        data.pending_pickup_medicine_stamp || null,
        data.processed_pickup_medicine_stamp || null,
        data.completed_pickup_medicine_stamp || null,
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
   * Mengambil record Pickup_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
   */
  static async findByNOP(NOP) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
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
      const [rows] = await conn.execute(query, [NOP]);
      return rows[0];
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

  /**
   * Mengambil semua record Pickup_Task.
   */
  static async getAll() {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
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
      const [rows] = await conn.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

  static async getPickupToday(){
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
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
      const [rows] = await conn.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

   static async getPickupDisplay(){
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
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
      const [rows] = await conn.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

   static async getPickupByDate(date){
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
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
      const [rows] = await conn.execute(query,[date]);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }
  /**
   * Memperbarui record Pickup_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
   * @param {Object} data - Data baru untuk update.
   */
  static async update(NOP, data) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
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
      const [loket] = await conn.execute(`
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
      const [result] = await conn.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

  /**
   * Menghapus record Pickup_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
   */
  static async delete(NOP) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `DELETE FROM Pickup_Task WHERE NOP = ?`;
      const [result] = await conn.execute(query, [NOP]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PickupTask;
