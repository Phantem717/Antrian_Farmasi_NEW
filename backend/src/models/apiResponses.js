// src/models/doctorAppointments.js
const { getDb } = require('../config/db');

class ApiResponses {
  /**
   * Creates a new API response record
   * @param {Object} responseData - Response data to be stored
   * @returns {Promise<Object>} - Database operation result
   */
  static async create(responseData) {
      const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      
      const query = `
        INSERT INTO api_responses (
          response,
          response_type,
          timestamp
        ) VALUES (?, ?, NOW())
      `;
      
      const values = [
        responseData.response,
        responseData.response_type
      ];
      
      const [result] = await conn.execute(query, values);
      return result;
      
    } catch (error) {
      console.error('Failed to create API response:', {
        error: error.message,
        responseData: JSON.stringify(responseData)
      });
      throw new Error(`Database operation failed: ${error.message}`);
    } finally {
    conn.release(); // ?? Critical cleanup
  }
  }
}

module.exports = ApiResponses;