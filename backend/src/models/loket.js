// src/models/loket.js
const { getDb } = require('../config/db');

class Loket {
  /**
   * Membuat record loket baru.
   * @param {Object} loketData - Data loket yang akan disimpan.
   */
  static async create(loketData) {
    try {
      const connection = getDb();
      const query = `
        INSERT INTO Loket (loket_name, description, status)
        VALUES (?, ?, ?)
      `;
      const values = [
        loketData.loket_name,
        loketData.description,
        loketData.status
      ];
      const [result] = await connection.execute(query, values);
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
      const connection = getDb();
      const query = `SELECT * FROM Loket WHERE loket_id = ?`;
      const [rows] = await connection.execute(query, [loket_id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mengambil semua record loket.
   */
  static async getAll() {
    try {
      const connection = getDb();
      const query = `SELECT * FROM Loket`;
      const [rows] = await connection.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Memperbarui record loket berdasarkan loket_id.
   * @param {number} loket_id - ID loket.
   * @param {Object} loketData - Data yang akan diupdate.
   */
  static async update(loket_id, loketData) {
    try {
      const connection = getDb();
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
      const [result] = await connection.execute(query, values);
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
      const connection = getDb();
      const query = `DELETE FROM Loket WHERE loket_id = ?`;
      const [result] = await connection.execute(query, [loket_id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Loket;
