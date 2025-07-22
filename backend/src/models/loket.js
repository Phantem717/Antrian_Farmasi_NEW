// src/models/loket.js
const { getDb } = require('../config/db');

class Loket {
  /**
   * Membuat record loket baru.
   * @param {Object} loketData - Data loket yang akan disimpan.
   */
  static async create(loketData) {

    try {
      const pool = await getDb();    
      const query = `
        INSERT INTO Loket (loket_name, description, status)
        VALUES (?, ?, ?)
      `;
      const values = [
        loketData.loket_name,
        loketData.description,
        loketData.status
      ];
      const [result] = await pool.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil record loket berdasarkan loket_id.
   * @param {number} loket_id - ID loket.
   */
  static async findById(loket_id) {

    try {
      const pool = await getDb();      
      const query = `SELECT * FROM Loket WHERE loket_id = ?`;
      const [rows] = await pool.execute(query, [loket_id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil semua record loket.
   */
  static async getAll() {
  const pool = await getDb();
  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query({
  sql: 'SELECT * FROM Loket',
  timeout: 5000, // 5-second timeout
});
    console.log("Query results:", rows);
    return rows; // Explicit return
  } catch (error) {
    console.error("Model error:", error);
    throw error; // Propagate error to controller
  } finally {
  conn.release(); // Critical: Release connection
  }
}
  /**
   * Memperbarui record loket berdasarkan loket_id.
   * @param {number} loket_id - ID loket.
   * @param {Object} loketData - Data yang akan diupdate.
   */
  static async update(loket_id, loketData) {

    try {
      const pool = await getDb();      
      const query = `
        UPDATE Loket
        SET loket_name = ?, description = ?, status = ?
        WHERE loket_id = ?
      `;
      const values = [
        loketData.loket_name,
        loketData.description,
        loketData.status,
        loket_id
      ];
      const [result] = await pool.execute(query, values);
      return result;
    } catch (error) {

      throw error;
    }
  }

  /**
   * Menghapus record loket berdasarkan loket_id.
   * @param {number} loket_id - ID loket.
   */
  static async delete(loket_id) {

    try {
      const pool = await getDb();      
      const query = `DELETE FROM Loket WHERE loket_id = ?`;
      const [result] = await pool.execute(query, [loket_id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Loket;
