// src/models/doctorAppointments.js
const { getDb } = require('../config/db');

class apiResponses {
  /**
   * Membuat record appointment baru.
   * @param {Object} responseData - Data appointment yang akan disimpan.
   */
  static async create(responseData) {
    try {
      const connection = getDb();
      const query = `
        INSERT INTO api_responses (
        response,
        response_type,
        timestamp
        ) VALUES (?, ?, NOW())
      `;
      const values = [
        responseData.response,
        responseData.response_type,
       
      ];
      const [result] = await connection.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }
  }


  


}

module.exports = apiResponses;
