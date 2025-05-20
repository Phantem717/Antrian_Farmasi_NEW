// src/models/pharmacyTask.js
const { getDb } = require('../config/db');

class PharmacyTask {
  /**
   * Membuat record task farmasi baru.
   * @param {Object} taskData - Data task yang akan disimpan.
   */
  static async create(taskData) {
    try {
      const connection = getDb();
      const query = `
        INSERT INTO Pharmacy_Task (booking_id, status, medicine_type,lokasi)
        VALUES ( ?, ?, ?,?)
      `;
      const values = [
        taskData.booking_id, // booking_id digunakan sebagai referensi
        taskData.status,
        taskData.medicine_type,
        taskData.lokasi
      ];
      const [result] = await connection.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil record task berdasarkan booking_id.
   * @param {number|string} booking_id - booking_id task farmasi.
   */
  static async findByBookingId(booking_id) {
    try {
      const connection = getDb();
      const query = `
      SELECT 
        da.booking_id,
        da.sep_no,
        da.patient_name,
        da.medical_record_no,
        da.queue_number,
        da.status_medicine,
        pt.status,
        pt.medicine_type
      FROM Pharmacy_Task pt
      JOIN Doctor_Appointments da ON pt.booking_id = da.booking_id
      WHERE da.booking_id = ?
      `;
      const [rows] = await connection.execute(query, [booking_id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil semua record task farmasi.
   */
  static async getAll() {
    try {
      const connection = getDb();
      const query = `
      SELECT 
        da.booking_id,
        da.sep_no,
        da.patient_name,
        da.medical_record_no,
        da.queue_number,
        da.status_medicine,
        pt.status,
        pt.medicine_type
      FROM Pharmacy_Task pt
      JOIN Doctor_Appointments da ON pt.booking_id = da.booking_id
      ORDER BY da.booking_id DESC;
      `;
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Memperbarui record task berdasarkan booking_id.
   * @param {number|string} booking_id - booking_id task farmasi.
   * @param {Object} taskData - Data task yang akan diupdate.
   */
  static async update(booking_id, taskData) {
    try {
      const connection = getDb();
      const query = `
        UPDATE Pharmacy_Task
        SET status = ?, medicine_type = ?
        WHERE booking_id = ?
      `;
      const values = [
        taskData.status,
        taskData.medicine_type,
        booking_id
      ];
      const [result] = await connection.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Menghapus record task berdasarkan booking_id.
   * @param {number|string} booking_id - booking_id task farmasi.
   */
  static async delete(booking_id) {
    try {
      const connection = getDb();
      const query = `DELETE FROM Pharmacy_Task WHERE booking_id = ?`;
      const [result] = await connection.execute(query, [booking_id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PharmacyTask;
