// src/models/pharmacyTask.js
const { getDb } = require('../config/db');

class PharmacyTask {
  /**
   * Membuat record task farmasi baru.
   * @param {Object} taskData - Data task yang akan disimpan.
   */
  static async create(taskData) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
        INSERT INTO Pharmacy_Task (NOP, status, medicine_type,lokasi)
        VALUES ( ?, ?, ?,?)
      `;
      const values = [
        taskData.NOP, // NOP digunakan sebagai referensi
        taskData.status,
        taskData.medicine_type,
        taskData.lokasi
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
   * Mengambil record task berdasarkan NOP.
   * @param {number|string} NOP - NOP task farmasi.
   */
  static async findByNOP(NOP) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
      SELECT 
        da.NOP,
        da.sep_no,
        da.patient_name,
        da.medical_record_no,
        da.queue_number,
        da.status_medicine,
        pt.status,
        pt.medicine_type
      FROM Pharmacy_Task pt
      JOIN Doctor_Appointments da ON pt.NOP = da.NOP
      WHERE da.NOP = ?
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
   * Mengambil semua record task farmasi.
   */
  static async getAll() {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
      SELECT 
        da.NOP,
        da.sep_no,
        da.patient_name,
        da.medical_record_no,
        da.queue_number,
        da.status_medicine,
        pt.status,
        pt.medicine_type
      FROM Pharmacy_Task pt
      JOIN Doctor_Appointments da ON pt.NOP = da.NOP
      ORDER BY da.NOP DESC;
      `;
      const [rows] = await conn.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

   static async getAllByStatus(location,status) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
      SELECT 
        da.NOP,
        da.sep_no,
        da.patient_name,
        da.medical_record_no,
        da.queue_number,
        da.status_medicine,
        pt.status,
        pt.medicine_type
      FROM Pharmacy_Task pt
      JOIN Doctor_Appointments da ON pt.NOP = da.NOP
      WHERE pt.status = ?
      AND pt.lokasi = ?
      ORDER BY da.NOP DESC;
      `;
      const values = [
        status,location
      ]
      const [rows] = await connection.execute(query, values);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }
  /**
   * Memperbarui record task berdasarkan NOP.
   * @param {number|string} NOP - NOP task farmasi.
   * @param {Object} taskData - Data task yang akan diupdate.
   */
  static async update(NOP, taskData) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
        UPDATE Pharmacy_Task
        SET status = ?, medicine_type = ?
        WHERE NOP = ?
      `;
      const values = [
        taskData.status,
        taskData.medicine_type,
        NOP
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
   * Menghapus record task berdasarkan NOP.
   * @param {number|string} NOP - NOP task farmasi.
   */
  static async delete(NOP) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `DELETE FROM Pharmacy_Task WHERE NOP = ?`;
      const [result] = await conn.execute(query, [NOP]);
      return result;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }
}

module.exports = PharmacyTask;
