// src/models/pharmacyTask.js
const { getDb } = require('../config/db');

class PharmacyTask {
  /**
   * Membuat record task farmasi baru.
   * @param {Object} taskData - Data task yang akan disimpan.
   */
  static async create(taskData) {
      let connection;

    try {
      const pool = await getDb();      connection = await pool.getConnection();
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
      const [result] = await pool.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil record task berdasarkan NOP.
   * @param {number|string} NOP - NOP task farmasi.
   */
  static async findByNOP(NOP) {
      let connection;

    try {
      const pool = await getDb();      connection = await pool.getConnection();
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
      const [rows] = await pool.execute(query, [NOP]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil semua record task farmasi.
   */
  static async getAll() {
      let connection;

    try {
      const pool = await getDb();      connection = await pool.getConnection();
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
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

   static async getAllByStatus(status) {
      let connection;

    try {
      const pool = await getDb();      connection = await pool.getConnection();
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
      ORDER BY da.NOP DESC;
      `;
      const [rows] = await pool.execute(query, [status]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Memperbarui record task berdasarkan NOP.
   * @param {number|string} NOP - NOP task farmasi.
   * @param {Object} taskData - Data task yang akan diupdate.
   */
  static async update(NOP, taskData) {
      let connection;

    try {
      const pool = await getDb();      connection = await pool.getConnection();
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
      const [result] = await pool.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus record task berdasarkan NOP.
   * @param {number|string} NOP - NOP task farmasi.
   */
  static async delete(NOP) {
      let connection;

    try {
      const pool = await getDb();      connection = await pool.getConnection();
      const query = `DELETE FROM Pharmacy_Task WHERE NOP = ?`;
      const [result] = await pool.execute(query, [NOP]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PharmacyTask;
