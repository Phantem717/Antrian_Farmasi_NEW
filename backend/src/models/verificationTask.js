// src/models/verificationTask.js
const { getDb } = require('../config/db');
const { getCurrentTimestamp } = require('../handler/timeHandler')
class VerificationTask {
  /**
   * Membuat record Verification_Task baru.
   * @param {Object} data - Data Verification_Task yang akan disimpan.
   *        Data diharapkan berisi:
   *          - NOP
   *          - Executor (opsional)
   *          - Executor_Names (opsional)
   *          - called_verification_stamp (opsional, dengan format MySQL TIMESTAMP)
   *          - recalled_verification_stamp (opsional)
   *          - pending_verification_stamp (opsional)
   *          - processed_verification_stamp (opsional)
   *          - completed_verification_stamp (opsional)
   * @returns {Promise<Object>} - Hasil query.
   */
  static async create(data, conn = null) {
  const pool = await getDb();
  const connection =conn || await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
        INSERT INTO Verification_Task (
          NOP, Executor, Executor_Names,
          waiting_verification_stamp, called_verification_stamp,
          recalled_verification_stamp, pending_verification_stamp,
          processed_verification_stamp, completed_verification_stamp,
          loket,lokasi
        )
        VALUES (?, ?, ?, ?,? , ?, ?, ?, ?, ?,?)
      `;
      const [loket] = await connection.execute(`
        SELECT loket_name 
        FROM Loket 
        WHERE status = "active" 
        AND (loket_name = "Loket 2" OR loket_name = "Loket 3") 
        LIMIT 1;
    `);
    const activeLoket = loket[0].loket_name;
    const timestamp = getCurrentTimestamp();
      const values = [
        data.NOP,
        data.Executor || null,
        data.Executor_Names || null,
        timestamp,
        // waiting_verification_stamp di-set otomatis menggunakan NOW()
        data.called_verification_stamp || null,
        data.recalled_verification_stamp || null,
        data.pending_verification_stamp || null,
        data.processed_verification_stamp || null,
        data.completed_verification_stamp || null,
        activeLoket || null,
        data.lokasi || null
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
   * Mengambil record Verification_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
   * @returns {Promise<Object>} - Record Verification_Task.
   */
  static async findByNOP(NOP) {
  const pool = await getDb();
  const conn = await pool.getConnection();

  try {
    const query = `
      /* ================= DOCTOR APPOINTMENTS ================= */
      SELECT 
        vt.*,
        da.patient_name,
        da.sep_no,
        da.medical_record_no,
        da.queue_number,
        da.farmasi_queue_number,
        da.phone_number,
        da.status_medicine,
        da.patient_date_of_birth,
        pt.status,
        pt.medicine_type,
        mt.loket AS loket2,
        da.isPaid,
        'doctor' AS source
      FROM Verification_Task vt
      JOIN Doctor_Appointments da ON vt.NOP = da.NOP
      LEFT JOIN Pharmacy_Task pt ON vt.NOP = pt.NOP
      LEFT JOIN Medicine_Task mt ON vt.NOP = mt.NOP
      WHERE vt.NOP = ?

      UNION ALL

      /* ================= GMCB APPOINTMENTS ================= */
      SELECT 
        vt.*,
        ga.patient_name,
        ga.sep_no,
        ga.medical_record_no,
        ga.queue_number,
        NULL AS farmasi_queue_number,
        ga.phone_number,
        ga.medicine_type AS status_medicine,
        ga.patient_date_of_birth,
        pt.status,
        pt.medicine_type,
        mt.loket AS loket2,
        ga.isPaid,
        'gmcb_appointment' AS source
      FROM Verification_Task vt
      JOIN gmcb_appointments ga ON vt.NOP = ga.NOP
      LEFT JOIN Pharmacy_Task pt ON vt.NOP = pt.NOP
      LEFT JOIN Medicine_Task mt ON vt.NOP = mt.NOP
      WHERE vt.NOP = ?

      UNION ALL

      /* ================= GMCB FARMASI TEMP ================= */
      SELECT 
        vt.*,
        NULL AS patient_name,
        NULL AS sep_no,
        NULL AS medical_record_no,
        gc.queue_number,
        NULL AS farmasi_queue_number,
        NULL AS phone_number,
        NULL AS status_medicine,
        NULL AS patient_date_of_birth,
        pt.status,
        pt.medicine_type,
        mt.loket AS loket2,
        FALSE AS isPaid,
        'gmcb_temp' AS source
      FROM Verification_Task vt
      JOIN gmcb_farmasi_temp gc ON vt.NOP = gc.id
      LEFT JOIN Pharmacy_Task pt ON vt.NOP = pt.NOP
      LEFT JOIN Medicine_Task mt ON vt.NOP = mt.NOP
      WHERE vt.NOP = ?
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
   * Mengambil semua record Verification_Task.
   * @returns {Promise<Array>} - Array dari semua record Verification_Task.
   */
  static async getAll() {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
       SELECT 
  vt.*, 
  da.patient_name,
  da.sep_no,
  da.medical_record_no,
  da.queue_number,
  da.farmasi_queue_number,
  da.patient_date_of_birth,
  da.status_medicine,
  da.phone_number,
  pt.status,
  pt.medicine_type,
          da.isPaid
FROM Verification_Task vt
LEFT JOIN Doctor_Appointments da ON vt.NOP = da.NOP
LEFT JOIN Pharmacy_Task pt ON vt.NOP = pt.NOP
WHERE  DATE(vt.waiting_verification_stamp) = CURRENT_DATE
ORDER BY vt.waiting_verification_stamp ASC;
      `;

      const [rows] = await conn.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }
static async getToday(location) {
  const pool = await getDb();
  const conn = await pool.getConnection();

  try {
    let query;
    let params = [];

    if (location === 'Lantai 1 GMCB') {
      // ✅ GMCB → UNION query
  query = `
    SELECT * FROM (
      /* ==========================
         GMCB Doctor Appointments
         ========================== */
      SELECT
        vt.*,
        ga.patient_name,
  ga.sep_no,
  ga.medical_record_no,
  ga.queue_number,
  ga.patient_date_of_birth,
  ga.medicine_type as status_medicine,
  ga.phone_number,

  pt.status,
  pt.medicine_type,
  ga.isPaid
    
     
      FROM Verification_Task vt
      JOIN gmcb_appointments ga ON vt.NOP = ga.NOP
      LEFT JOIN Pharmacy_Task pt ON vt.NOP = pt.NOP
      WHERE vt.lokasi = ?

      UNION ALL

      /* ==========================
         GMCB Independent Queue
         ========================== */
      SELECT
        vt.*,
        NULL                    AS patient_name,
        NULL                    AS sep_no,
        NULL                    AS medical_record_no,
        gc.queue_number         AS queue_number,
        NULL                    AS patient_date_of_birth,
        NULL                    AS status_medicine,
        NULL                    AS phone_number,
      
        pt.status,
        pt.medicine_type,
        FALSE                   AS isPaid
      FROM Verification_Task vt
      JOIN gmcb_farmasi_temp gc ON vt.NOP = gc.id
      LEFT JOIN Pharmacy_Task pt ON vt.NOP = pt.NOP
      WHERE vt.lokasi = ?
    ) gmcb
    WHERE DATE(waiting_verification_stamp) = CURRENT_DATE
      AND (
        status IS NULL
        OR (status != 'completed_verification' AND status LIKE '%verification%')
      )
    ORDER BY waiting_verification_stamp ASC
  `;

  params = [location, location];

    } else {
      // ✅ BPJS / LT3 / others → normal query
      query = `
    SELECT
  vt.*,
     da.patient_name,
  da.sep_no,
  da.medical_record_no,
  da.queue_number,
  da.farmasi_queue_number,
  da.patient_date_of_birth,
  da.status_medicine,
  da.phone_number,

  pt.status,
  pt.medicine_type,
  da.isPaid
    
FROM Verification_Task vt
LEFT JOIN Doctor_Appointments da ON vt.NOP = da.NOP
LEFT JOIN Pharmacy_Task pt ON vt.NOP = pt.NOP
WHERE DATE(vt.waiting_verification_stamp) = CURRENT_DATE AND (pt.status IS NULL OR (pt.status != 'completed_verification' AND pt.status LIKE '%verification%'))
AND vt.lokasi = ?
      `;
      params = [location];
    }

    const [rows] = await conn.execute(query, params);
    return rows;

  } catch (err) {
    throw err;
  } finally {
    conn.release();
  }
}

  
  static async getByDate(location,date){
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      let query;
      let params = [];
    if (location === "Lantai 1 GMCB") {
  query = `
    SELECT * FROM (
      /* ==========================
         GMCB Doctor Appointments
         ========================== */
      SELECT
        vt.*,
           ga.patient_name,
  ga.sep_no,
  ga.medical_record_no,
  ga.queue_number,
  ga.patient_date_of_birth,
  ga.medicine_type as status_medicine,
  ga.phone_number,

  pt.status,
  pt.medicine_type,
  ga.isPaid
    
      FROM Verification_Task vt
      JOIN gmcb_appointments ga ON vt.NOP = ga.NOP
      LEFT JOIN Pharmacy_Task pt ON vt.NOP = pt.NOP
      WHERE (ga.queue_number LIKE '%RC%' OR ga.queue_number LIKE '%NR%')
        AND DATE(vt.waiting_verification_stamp) = ?
        AND vt.waiting_verification_stamp IS NOT NULL
        AND vt.lokasi = ?

      UNION ALL

      /* ==========================
         GMCB Independent Queue
         ========================== */
      SELECT
        vt.*,
        NULL                    AS patient_name,
        NULL                    AS sep_no,
        NULL                    AS medical_record_no,
        gc.queue_number         AS queue_number,
        NULL                    AS patient_date_of_birth,
        NULL                    AS status_medicine,
        NULL                    AS phone_number,
        pt.status,
        pt.medicine_type,
        FALSE                   AS isPaid
      FROM Verification_Task vt
      JOIN gmcb_farmasi_temp gc ON vt.NOP = gc.id
      LEFT JOIN Pharmacy_Task pt ON vt.NOP = pt.NOP
      WHERE DATE(vt.waiting_verification_stamp) = ?
        AND vt.waiting_verification_stamp IS NOT NULL
        AND vt.lokasi = ?
    ) gmcb
    WHERE (
      status IS NULL
      OR (status != 'completed_verification' AND status LIKE '%verification%')
    )
    ORDER BY waiting_verification_stamp ASC
  `;

  params = [
    date, location,   // appointment
    date, location    // independent
  ];
}

      else{  query = `
       SELECT 
  vt.*, 
  da.patient_name,
  da.sep_no,
  da.medical_record_no,
  da.queue_number,
  da.patient_date_of_birth,
  da.status_medicine,
  da.phone_number,
  da.doctor_name,
  pt.status,
  pt.medicine_type,
          da.isPaid
FROM Verification_Task vt
LEFT JOIN Doctor_Appointments da ON vt.NOP = da.NOP
LEFT JOIN Pharmacy_Task pt ON vt.NOP = pt.NOP
WHERE DATE(vt.waiting_verification_stamp) = ?
  AND vt.waiting_verification_stamp IS NOT NULL
  AND (pt.status IS NULL OR 
       (pt.status != 'completed_verification' AND pt.status LIKE '%verification%'))
       AND vt.lokasi = ?
ORDER BY vt.waiting_verification_stamp ASC;
      `;
      params = [
        date,
        location
      ]
      }
      
      const [rows] = await conn.execute(query, params);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }
  /**
   * Memperbarui record Verification_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
   * @param {Object} data - Data baru untuk update.
   *        Data diharapkan berisi:
   *          - Executor (opsional)
   *          - Executor_Names (opsional)
   *          - called_verification_stamp (opsional)
   *          - recalled_verification_stamp (opsional)
   *          - pending_verification_stamp (opsional)
   *          - processed_verification_stamp (opsional)
   *          - completed_verification_stamp (opsional)
   * @returns {Promise<Object>} - Hasil query update.
   */
  static async update(NOP, data) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
        UPDATE Verification_Task
        SET Executor = ?,
            Executor_Names = ?,
            waiting_verification_stamp = ?,
            called_verification_stamp = ?,
            recalled_verification_stamp = ?,
            pending_verification_stamp = ?,
            processed_verification_stamp = ?,
            completed_verification_stamp = ?,
            loket = ?
        WHERE NOP = ?
      `;
      const [loket] = await conn.execute(`
        SELECT loket_name 
        FROM Loket 
        WHERE status = "active" 
        AND (loket_name = "Loket 2" OR loket_name = "Loket 3") 
        LIMIT 1;
    `);
    const activeLoket = loket[0].loket_name;
      const values = [
        data.Executor || null,
        data.Executor_Names || null,
        data.waiting_verification_stamp,  // tidak menggunakan NOW()
        data.called_verification_stamp || null,
        data.recalled_verification_stamp || null,
        data.pending_verification_stamp || null,
        data.processed_verification_stamp || null,
        data.completed_verification_stamp || null,
        activeLoket || null,
        NOP,
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
   * Menghapus record Verification_Task berdasarkan NOP.
   * @param {number} NOP - ID task.
   * @returns {Promise<Object>} - Hasil query delete.
   */
  static async delete(NOP) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `DELETE FROM Verification_Task WHERE NOP = ?`;
      const [result] = await conn.execute(query, [NOP]);
      return result;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }
}

module.exports = VerificationTask;
