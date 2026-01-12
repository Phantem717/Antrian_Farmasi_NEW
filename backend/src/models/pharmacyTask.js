// src/models/pharmacyTask.js
const { getDb } = require('../config/db');

class PharmacyTask {
  /**
   * Membuat record task farmasi baru.
   * @param {Object} taskData - Data task yang akan disimpan.
   */
  static async create(taskData, conn = null) {
  const pool = await getDb();
  const connection =conn || await pool.getConnection(); // ? Explicit connection

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
      const [result] = await connection.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }finally {
    if (!conn) connection.release(); // only release if we created it
  }
  }

  /**
   * Mengambil record task berdasarkan NOP.
   * @param {number|string} NOP - NOP task farmasi.
   */
  static async findByNOP(NOP) {
  const pool = await getDb();
  const conn = await pool.getConnection();

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
        pt.medicine_type,
        'doctor' AS source
      FROM Doctor_Appointments da
      LEFT JOIN Pharmacy_Task pt ON pt.NOP = da.NOP
      WHERE da.NOP = ?

      UNION ALL

      SELECT
        ga.NOP,
        ga.sep_no,
        ga.patient_name,
        ga.medical_record_no,
        ga.queue_number,
        ga.medicine_type AS status_medicine,
        pt.status,
        pt.medicine_type,
        'gmcb_appointment' AS source
      FROM gmcb_appointments ga
      LEFT JOIN Pharmacy_Task pt ON pt.NOP = ga.NOP
      WHERE ga.NOP = ?

      UNION ALL

      SELECT
        gc.id AS NOP,
        NULL AS sep_no,
        NULL AS patient_name,
        NULL AS medical_record_no,
        gc.queue_number,
        NULL AS status_medicine,
        pt.status,
        pt.medicine_type,
        'gmcb_temp' AS source
      FROM gmcb_farmasi_temp gc
      LEFT JOIN Pharmacy_Task pt ON pt.NOP = gc.id
      WHERE gc.id = ? AND gc.isChanged = 0
    `;

    const [rows] = await conn.execute(query, [NOP, NOP, NOP]);

    return rows[0] || null;
  } catch (error) {
    throw error;
  } finally {
    conn.release();
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
  let values = [];
  let query;
    try {
      if(location == "Lantai 1 BPJS")
{
query = `
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
      values = [
        status,location
      ]
}     else{
query = `
SELECT 
  gc.NOP,
  gc.sep_no,
  gc.patient_name,
  gc.medical_record_no,
  gc.queue_number,
  gc.medicine_type as status_medicine,
  pt.status,
  pt.medicine_type
FROM Pharmacy_Task pt
JOIN gmcb_Appointments gc ON pt.NOP = gc.NOP
WHERE pt.status = ?
  AND pt.lokasi = ?

UNION ALL

SELECT 
  gt.id as NOP,
        NULL AS sep_no,
  NULL as patient_name,
  NULL as medical_record_no,
  gt.queue_number,
  NULL as status_medicine,
  pt.status,
  NULL as medicine_type
FROM Pharmacy_Task pt
JOIN gmcb_farmasi_temp gt ON pt.NOP = gt.id
WHERE pt.status = ?
  AND pt.lokasi = ?

ORDER BY NOP DESC;
      `;
      values = [
        status,location,status,location
      ]
}
      const [rows] = await conn.execute(query, values);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

    static async getToday(location) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection
  let values = [];
  let query;
    try {
      if(location == "Lantai 1 BPJS")
{
query = `
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
      JOIN Verification_Task vt ON pt.NOP = vt.NOP
      WHERE date(vt.waiting_verification_stamp) = CURRENT_DATE
      AND pt.lokasi = ?
      ORDER BY da.NOP DESC;
      `;
      values = [
       location
      ]
}     else{
query = `
SELECT 
  gc.NOP,
  gc.sep_no,
  gc.patient_name,
  gc.medical_record_no,
  gc.queue_number,
  gc.medicine_type as status_medicine,
  pt.status,
  pt.medicine_type
FROM Pharmacy_Task pt
JOIN gmcb_Appointments gc ON pt.NOP = gc.NOP
      JOIN Verification_Task vt ON pt.NOP = vt.NOP
      WHERE date(vt.waiting_verification_stamp) = CURRENT_DATE
  AND pt.lokasi = ?

UNION ALL

SELECT 
  gt.id as NOP,
        NULL AS sep_no,
  NULL as patient_name,
  NULL as medical_record_no,
  gt.queue_number,
  NULL as status_medicine,
  pt.status,
  NULL as medicine_type
FROM Pharmacy_Task pt
JOIN gmcb_farmasi_temp gt ON pt.NOP = gt.id
      JOIN Verification_Task vt ON pt.NOP = vt.NOP
      WHERE date(vt.waiting_verification_stamp) = CURRENT_DATE
  AND pt.lokasi = ?


ORDER BY NOP DESC;
      `;
      values = [
        location,location
      ]
}
      const [rows] = await conn.execute(query, values);
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
