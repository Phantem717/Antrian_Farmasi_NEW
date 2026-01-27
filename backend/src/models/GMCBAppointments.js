// src/models/doctorAppointments.js
const { getDb } = require('../config/db');
class GMCBAppointments {
  /**
   * Membuat record appointment baru.
   * @param {Object} appointmentData - Data appointment yang akan disimpan.
   */
  static async create(appointmentData,conn = null) {
    console.log("APPOINTMENT DATA",appointmentData);
  const pool = await getDb();
  const connection = conn || await pool.getConnection(); // ? Explicit connection
    try {
     const query = `
  INSERT INTO gmcb_appointments (
    NOP,
    sep_no,
    queue_number,
    queue_status,
    patient_name,
    medical_record_no,
    patient_date_of_birth,
    medicine_type,
    lokasi,
    location_from,
    phone_number,
    doctor_name,
    nik,
    poliklinik,
    payment_type,
    isPaid,
    total_medicine
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
const values = [
  appointmentData.NOP,
  appointmentData.sep_no,
  appointmentData.queue_number,
  appointmentData.queue_status,
  appointmentData.patient_name,
  appointmentData.medical_record_no,
  appointmentData.patient_date_of_birth,
  appointmentData.medicine_type?? appointmentData.status_medicine,      // ✅ FIXED
  appointmentData.lokasi,
  appointmentData.location_from,
  appointmentData.phone_number,
  appointmentData.doctor_name,
  appointmentData.nik,
  appointmentData.poliklinik,
  appointmentData.payment_type,
  appointmentData.isPaid,
  appointmentData.total_medicine ?? 0 // ✅ safe default
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
FROM gmcb_appointments da
WHERE da.queue_number LIKE '%RC%' OR da.queue_number LIKE '%NR%'
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
FROM gmcb_appointments da
WHERE da.queue_number LIKE '%RC%' OR da.queue_number LIKE '%NR%'
AND da.lokasi = ?
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
   * @param {string} NOP - ID booking appointment.
   */
  static async findByNOP(NOP) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `SELECT * FROM gmcb_appointments WHERE NOP = ?`;
      const [rows] = await conn.execute(query, [NOP]);
      return rows[0];
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

  /**
   * Memperbarui record appointment berdasarkan booking_id.
   * @param {string} NOP - ID booking appointment.
   * @param {Object} appointmentData - Data appointment yang akan diupdate.
   */

  static async updateStatusMedicine(NOP, status_medicine) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
        UPDATE gmcb_appointments 
        SET status_medicine = ?
        WHERE NOP = ?
      `;
      const values = [status_medicine, NOP];

      const [result] = await conn.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
}

  static async updateDoctorAppointment(NOP, queue_number) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
      UPDATE gmcb_appointments 
      SET queue_number = ?
      WHERE NOP = ?
      `;
      const values = [queue_number,  NOP];

      const [result] = await conn.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
}

 static async updatePhoneNumber(NOP,phone_number) {
      const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection


    try {
      const query = `
        UPDATE gmcb_appointments 
        SET phone_number = ?
        WHERE NOP = ?
      `;
      const values = [phone_number, NOP];

      const [result] = await conn.execute(query, values);
      return result;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
}

static async updateMedicineType(NOP,status_medicine,farmasi_queue_number){

  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
    const query = `
      UPDATE gmcb_appointments 
      SET status_medicine = ?,
      farmasi_queue_number = ?,
      queue_number = ?
      WHERE NOP = ?
    `;
    const values = [status_medicine,farmasi_queue_number,farmasi_queue_number, NOP];

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
      const query = `SELECT queue_number,NOP 
FROM gmcb_appointments
ORDER BY NOP DESC LIMIT 1
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

static async getLatestAntrianJaminan(type) {
    const pool = await getDb();
    const conn = await pool.getConnection();
    
    // 1. CRITICAL: Define the pattern to search for (e.g., 'C-%' or 'D-%')
    const queuePattern = `%${type}-%`; 

    try {
        const query = `
            SELECT queue_number, NOP
            FROM gmcb_appointments
            
            -- FIX: Use the LIKE clause to filter by the start of the queue_number
            WHERE queue_number LIKE ? 
            
            ORDER BY NOP DESC 
            LIMIT 1
        `;

        // 2. Execute the query using the pattern
        const [rows] = await conn.execute(query, [queuePattern]); // Pass [queuePattern] here
        
        // If no rows match (e.g., first 'D' entry ever), rows[0] will be null,
        // which correctly triggers the 'D-001' logic in the controller.
        return rows[0] || null; 
    } catch (error) {
        throw error;
    } finally {
        conn.release();
    }
}

  /**
   * Menghapus record appointment berdasarkan booking_id.
   * @param {string} NOP - ID booking appointment.
   */
  static async delete(NOP) {
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `DELETE FROM gmcb_appointments WHERE NOP = ?`;
      const [result] = await conn.execute(query, [NOP]);
      return result;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

  static async updateTotalMedicine(NOP, total_medicine) {
    const pool = await getDb();
    const conn = await pool.getConnection(); // ? Explicit connection
  
      try {
        const query = `
          UPDATE gmcb_appointments 
          SET total_medicine = ?
          WHERE NOP = ?
        `;
        const values = [total_medicine, NOP];
  
        const [result] = await conn.execute(query, values);
        return result;
      } catch (error) {
        throw error;
      }finally {
      conn.release(); // ?? Critical cleanup
    }
  }

  
  static async getByDateForTotal(location,date){
  const pool = await getDb();
  const conn = await pool.getConnection(); // ? Explicit connection

    try {
      const query = `
       SELECT 
  da.NOP
FROM gmcb_appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP

WHERE (da.queue_number LIKE '%RC%' OR da.queue_number LIKE '%NR%')
  AND DATE(vt.waiting_verification_stamp) = ?
  AND vt.lokasi = ?
ORDER BY vt.waiting_verification_stamp ASC;
      `;
      const values = [
        date,
        location
      ]
      const [rows] = await conn.execute(query, values);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
  }

static async updatePaymentStatus(NOP, isPaid) {
    const pool = await getDb();
    const conn = await pool.getConnection(); // ? Explicit connection
  
      try {
        const query = `
          UPDATE gmcb_appointments 
          SET isPaid = ?
          WHERE NOP = ?
        `;
        const values = [isPaid, NOP];
  
        const [result] = await conn.execute(query, values);
        return result;
      } catch (error) {
        throw error;
      }finally {
      conn.release(); // ?? Critical cleanup
    }
  }
}

module.exports = GMCBAppointments;
