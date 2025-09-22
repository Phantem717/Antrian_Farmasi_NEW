const { getDb } = require('../config/db');

class Status{
 static async getPharmacyStatusByNoTelpon(phone_number,date_of_birth,location){
   const pool = await getDb();
  const conn = await pool.getConnection();
    try {
 // ? Explicit connection
      const query = `SELECT 
    pa.waiting_pickup_medicine_stamp as "Obat Siap Diambil",
    pa.called_pickup_medicine_stamp as "Obat Telah Dipanggil",
    pa.completed_pickup_medicine_stamp as "Obat Telah Selesai",
    mt.waiting_medicine_stamp as "Menunggu Obat",
    mt.completed_medicine_stamp as "Obat Selesai Dikemas",
    vt.waiting_verification_stamp as "Obat Sedang Verifikasi",
    vt.completed_verification_stamp as "Obat Selesai Verifikasi"
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE da.phone_number = ? AND da.patient_date_of_birth = ?
AND da.lokasi = ?
ORDER BY da.queue_number`;
      const [rows] = await conn.execute(query, [phone_number,date_of_birth,location]);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
 }

  static async getPharmacyStatusByNIK(nik,date_of_birth,location){
     const pool = await getDb();
  const conn = await pool.getConnection();
    try {
 // ? Explicit connection
      const query = `SELECT 
    pa.waiting_pickup_medicine_stamp as "Obat Siap Diambil",
    pa.called_pickup_medicine_stamp as "Obat Telah Dipanggil",
    pa.completed_pickup_medicine_stamp as "Obat Telah Selesai",
    mt.waiting_medicine_stamp as "Menunggu Obat",
    mt.completed_medicine_stamp as "Obat Selesai Dikemas",
    vt.waiting_verification_stamp as "Obat Sedang Verifikasi",
    vt.completed_verification_stamp as "Obat Selesai Verifikasi"
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE da.NIK = ? AND da.patient_date_of_birth = ?
AND da.lokasi = ?
ORDER BY da.queue_number`;
      const [rows] = await conn.execute(query, [nik,date_of_birth,location]);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
 }

  static async getPharmacyStatusByName(full_name,date_of_birth,location){
    console.log("VARS",full_name,date_of_birth,location);
     const pool = await getDb();
  const conn = await pool.getConnection();
    try {
// ? Explicit connection
      const query = `SELECT 
     pa.waiting_pickup_medicine_stamp as "Obat Siap Diambil",
    pa.called_pickup_medicine_stamp as "Obat Telah Dipanggil",
    pa.completed_pickup_medicine_stamp as "Obat Telah Selesai",
    mt.waiting_medicine_stamp as "Menunggu Obat",
    mt.completed_medicine_stamp as "Obat Selesai Dikemas",
    vt.waiting_verification_stamp as "Obat Sedang Verifikasi",
    vt.completed_verification_stamp as "Obat Selesai Verifikasi"
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE da.patient_name = ?
AND da.lokasi = ? AND da.patient_date_of_birth = ?
ORDER BY da.queue_number`;
      const [rows] = await conn.execute(query, [full_name,location,date_of_birth]);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
 }
}
;

module.exports = Status;