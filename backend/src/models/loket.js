// src/models/loket.js
const { getDb } = require('../config/db');

class Loket {
  /**
   * Membuat record loket baru.
   * @param {Object} loketData - Data loket yang akan disimpan.
   */
  static async create(loketData) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
        INSERT INTO Loket (loket_name, description, status)
        VALUES (?, ?, ?)
      `;
      const values = [
        loketData.loket_name,
        loketData.description,
        loketData.status
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
   * Mengambil record loket berdasarkan loket_id.
   * @param {number} loket_id - ID loket.
   */
  static async findById(loket_id) {
  const pool = await getDb();
  const conn = await pool.getConnection(); 
    try {
      const query = `SELECT * FROM Loket WHERE loket_id = ?`;
      const [rows] = await conn.execute(query, [loket_id]);
      return rows[0];
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

  /**
   * Mengambil semua record loket.
   */
 static async getAll() {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

  try {
    const [rows] = await conn.query('SELECT * FROM Loket');
    console.log("LOKET",rows);
    return rows;
  } finally {
    conn.release(); // ?? Critical cleanup
  }
}

  /**
   * Memperbarui record loket berdasarkan loket_id.
   * @param {number} loket_id - ID loket.
   * @param {Object} loketData - Data yang akan diupdate.
   */
  static async update(loket_id, loketData) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
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
      const [result] = await conn.execute(query, values);
      return result;
    } catch (error) {

      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

  /**
   * Menghapus record loket berdasarkan loket_id.
   * @param {number} loket_id - ID loket.
   */
  static async delete(loket_id) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `DELETE FROM Loket WHERE loket_id = ?`;
      const [result] = await conn.execute(query, [loket_id]);
      return result;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }
}

module.exports = Loket;
