// src/models/doctorAppointments.js
const { getDb } = require('../config/db');
const {getCurrentTimestamp} = require('../handler/timeHandler')

class GMCBTemp {
  /**
   * Membuat record appointment baru.
   * @param {Object} appointmentData - Data appointment yang akan disimpan.
   */
  static async create(appointmentData,conn = null) {
  const pool = await getDb();
  const connection = conn || await pool.getConnection(); // ? Explicit connection
  const timestamp = getCurrentTimestamp();
    console.log("APPOINTMENT DATA",appointmentData);
    try {
      const query = `
        INSERT INTO gmcb_farmasi_temp (
        id,
          queue_number,
          queue_status,
          queue_type,
          location,
          timestamp
        ) VALUES (?,?, ?, ?, ?, ?)
      `;
      const values = [
        appointmentData.id,
        appointmentData.queue_number,
        appointmentData.queue_status,
        appointmentData.queue_type,
        appointmentData.location,
        timestamp
      ];

      const [result] = await connection.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }finally {
    if (!conn) connection.release(); // only release if we created it
  }
  }

  /**
   * Mengambil semua record appointment tanpa limit.
   */
  static async findAll() {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `SELECT * 
FROM gmcb_farmasi_temp da
WHERE da.queue_number
ORDER BY da.queue_number`;
      const [rows] = await conn.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

  static async findAllByLocation(location) {
    try {
 const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection
      const query = `SELECT * 
FROM gmcb_farmasi_temp da
WHERE da.queue_number
AND da.location = ?
ORDER BY da.queue_number`;
      const [rows] = await conn.execute(query, [location]);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

  /**
   * Mengambil record appointment berdasarkan booking_id.
   * @param {string} id - ID booking appointment.
   */
  static async findById(id) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `SELECT * FROM gmcb_farmasi_temp WHERE id = ?`;
      const [rows] = await conn.execute(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

  /**
   * Memperbarui record appointment berdasarkan booking_id.
   * @param {string} id - ID booking appointment.
   * @param {Object} appointmentData - Data appointment yang akan diupdate.
   */

  static async updateStatus(queue_status, id) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
        UPDATE gmcb_farmasi_temp 
        SET queue_status = ?
        WHERE id = ?
      `;
      const values = [queue_status,id];

      const [result] = await conn.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
}

  static async getLatestAntrian() {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `SELECT queue_number
FROM gmcb_farmasi_temp
ORDER BY id DESC LIMIT 1
`;

      const [rows] = await conn.execute(query);
      return rows[0]; // Instead of returning the whole array
    } catch (error) {
      throw error;
    } finally {
    conn.release(); // ?? Critical cleanup
  }
  }
// Inside ../models/doctorAppointments.js

  /**
   * Menghapus record appointment berdasarkan booking_id.
   * @param {string} id - ID booking appointment.
   */
  static async delete(id) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `DELETE FROM gmcb_farmasi_temp WHERE id = ?`;
      const [result] = await conn.execute(query, [id]);
      return result;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

}

module.exports = GMCBTemp;
