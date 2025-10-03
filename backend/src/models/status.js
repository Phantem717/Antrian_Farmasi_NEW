const { getDb } = require('../config/db');

class Status{
 static async getPharmacyStatusByNoTelpon(phone_number,date_of_birth,location){
   const pool = await getDb();
  const conn = await pool.getConnection();
    try {
 // ? Explicit connection
      const query = `SELECT 
    
     vt.waiting_verification_stamp as "Obat Sedang Verifikasi",
    vt.completed_verification_stamp as "Obat Selesai Verifikasi",
    mt.waiting_medicine_stamp as "Menunggu Obat",
    mt.completed_medicine_stamp as "Obat Selesai Dikemas",
    pa.waiting_pickup_medicine_stamp as "Obat Siap Diambil",
    pa.called_pickup_medicine_stamp as "Obat Telah Dipanggil",
    pa.completed_pickup_medicine_stamp as "Obat Telah Selesai",
   
    da.queue_number as "Nomor Antrian",
    -- ✅ Simple daily queue position
    (SELECT COUNT(*) 
     FROM Doctor_Appointments da2 
     LEFT JOIN Verification_Task vt2 ON da2.NOP = vt2.NOP
     WHERE vt2.completed_verification_stamp IS NULL
     AND da2.lokasi = da.lokasi
     AND DATE(vt2.waiting_verification_stamp) = DATE(vt.waiting_verification_stamp)  -- ⬅️ SAME DAY
     AND vt2.waiting_verification_stamp < vt.waiting_verification_stamp  -- ⬅️ Created earlier today
    ) + 1 AS current_position,
    DATE(vt.waiting_verification_stamp) as "Tanggal Antrian",
    da.NOP,
    da.status_medicine
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE da.phone_number = ? AND da.patient_date_of_birth = ?
AND da.lokasi = ?
ORDER BY vt.waiting_verification_stamp ASC;  -- Order by creation time for queue sequence`;
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
    vt.waiting_verification_stamp as "Obat Sedang Verifikasi",
    vt.completed_verification_stamp as "Obat Selesai Verifikasi",
    mt.waiting_medicine_stamp as "Menunggu Obat",
    mt.completed_medicine_stamp as "Obat Selesai Dikemas",
    pa.waiting_pickup_medicine_stamp as "Obat Siap Diambil",
    pa.called_pickup_medicine_stamp as "Obat Telah Dipanggil",
    pa.completed_pickup_medicine_stamp as "Obat Telah Selesai",
    da.queue_number as "Nomor Antrian",
    -- ✅ Simple daily queue position
    (SELECT COUNT(*) 
     FROM Doctor_Appointments da2 
     LEFT JOIN Verification_Task vt2 ON da2.NOP = vt2.NOP
     WHERE vt2.completed_verification_stamp IS NULL
     AND da2.lokasi = da.lokasi
     AND DATE(vt2.waiting_verification_stamp) = DATE(vt.waiting_verification_stamp)  -- ⬅️ SAME DAY
     AND vt2.waiting_verification_stamp < vt.waiting_verification_stamp  -- ⬅️ Created earlier today
    ) + 1 AS current_position,
    DATE(vt.waiting_verification_stamp) as "Tanggal Antrian",
    da.NOP,
    da.status_medicine
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE da.phone_number = ? AND da.patient_date_of_birth = ?
AND da.lokasi = ?
ORDER BY vt.waiting_verification_stamp ASC; 

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
    vt.waiting_verification_stamp as "Obat Sedang Verifikasi",
    vt.completed_verification_stamp as "Obat Selesai Verifikasi",
    mt.waiting_medicine_stamp as "Menunggu Obat",
    mt.completed_medicine_stamp as "Obat Selesai Dikemas",
    pa.waiting_pickup_medicine_stamp as "Obat Siap Diambil",
    pa.called_pickup_medicine_stamp as "Obat Telah Dipanggil",
    pa.completed_pickup_medicine_stamp as "Obat Telah Selesai",
    da.queue_number as "Nomor Antrian",
    -- ✅ Simple daily queue position
    (SELECT COUNT(*) 
     FROM Doctor_Appointments da2 
     LEFT JOIN Verification_Task vt2 ON da2.NOP = vt2.NOP
     WHERE vt2.completed_verification_stamp IS NULL
     AND da2.lokasi = da.lokasi
     AND DATE(vt2.waiting_verification_stamp) = DATE(vt.waiting_verification_stamp)
     AND vt2.waiting_verification_stamp < vt.waiting_verification_stamp
    ) + 1 AS current_position,
    DATE(vt.waiting_verification_stamp) as "Tanggal Antrian",
    da.NOP ,
    da.status_medicine
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE da.patient_name like ?
AND da.lokasi = ? 
AND da.patient_date_of_birth = ?
ORDER BY vt.waiting_verification_stamp ASC;`;
      const [rows] = await conn.execute(query, [full_name,location,date_of_birth]);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
 }

 static async getPharmacyTimestampByNoTelpon(phone_number,date_of_birth,location){
   const pool = await getDb();
  const conn = await pool.getConnection();
    try {
 // ? Explicit connection
      const query = `SELECT 
    (SELECT COUNT(*) 
     FROM Doctor_Appointments da2 
     LEFT JOIN Verification_Task vt2 ON da2.NOP = vt2.NOP
     WHERE vt2.completed_verification_stamp IS NULL
       AND da2.lokasi = da.lokasi
       AND DATE(vt2.waiting_verification_stamp) = DATE(vt.waiting_verification_stamp)  -- same day
       AND vt2.waiting_verification_stamp < vt.waiting_verification_stamp              -- earlier today
    ) + 1 AS current_position,
    DATE(vt.waiting_verification_stamp) AS Tanggal_Antrian,
    da.NOP,
    da.status_medicine
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE da.phone_number = ?
  AND da.patient_date_of_birth = ?
  AND vt.waiting_verification_stamp IS NOT NULL
  AND da.lokasi = ?
ORDER BY vt.waiting_verification_stamp DESC;`;
      const [rows] = await conn.execute(query, [phone_number,date_of_birth,location]);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
 }

  static async getPharmacyTimestampByNIK(nik,date_of_birth,location){
     const pool = await getDb();
  const conn = await pool.getConnection();
    try {
 // ? Explicit connection
      const query = `SELECT 
    (SELECT COUNT(*) 
     FROM Doctor_Appointments da2 
     LEFT JOIN Verification_Task vt2 ON da2.NOP = vt2.NOP
     WHERE vt2.completed_verification_stamp IS NULL
       AND da2.lokasi = da.lokasi
       AND DATE(vt2.waiting_verification_stamp) = DATE(vt.waiting_verification_stamp)  -- same day
       AND vt2.waiting_verification_stamp < vt.waiting_verification_stamp              -- earlier today
    ) + 1 AS current_position,
    DATE(vt.waiting_verification_stamp) AS Tanggal_Antrian,
    da.NOP,
    da.status_medicine
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE da.nik = ?
  AND da.patient_date_of_birth = ?
  AND vt.waiting_verification_stamp IS NOT NULL
  AND da.lokasi = ?
ORDER BY vt.waiting_verification_stamp DESC;`;
      const [rows] = await conn.execute(query, [nik,date_of_birth,location]);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
 }

  static async getPharmacyTimestampByName(full_name,date_of_birth,location){
    console.log("VARS",full_name,date_of_birth,location);
     const pool = await getDb();
  const conn = await pool.getConnection();
    try {
// ? Explicit connection
      const query = `SELECT 
    (SELECT COUNT(*) 
     FROM Doctor_Appointments da2 
     LEFT JOIN Verification_Task vt2 ON da2.NOP = vt2.NOP
     WHERE vt2.completed_verification_stamp IS NULL
       AND da2.lokasi = da.lokasi
       AND DATE(vt2.waiting_verification_stamp) = DATE(vt.waiting_verification_stamp)  -- same day
       AND vt2.waiting_verification_stamp < vt.waiting_verification_stamp              -- earlier today
    ) + 1 AS current_position,
    DATE(vt.waiting_verification_stamp) AS Tanggal_Antrian,
    da.NOP,
    da.status_medicine
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE da.patient_name = ?
  AND da.patient_date_of_birth = ?
  AND vt.waiting_verification_stamp IS NOT NULL
  AND da.lokasi = ?
ORDER BY vt.waiting_verification_stamp DESC;`;
      const [rows] = await conn.execute(query, [full_name,location,date_of_birth]);
      return rows;
    } catch (error) {
      throw error;
    }finally {
    conn.release(); // ?? Critical cleanup
  }
 }


 static async getPharmacyByNOP(NOP){
   const pool = await getDb();
  const conn = await pool.getConnection();
    try {
// ? Explicit connection
      const query = `SELECT 
    vt.waiting_verification_stamp as "Obat Sedang Verifikasi",
    vt.completed_verification_stamp as "Obat Selesai Verifikasi",
    mt.waiting_medicine_stamp as "Menunggu Obat",
    mt.completed_medicine_stamp as "Obat Selesai Dikemas",
    pa.waiting_pickup_medicine_stamp as "Obat Siap Diambil",
    pa.called_pickup_medicine_stamp as "Obat Telah Dipanggil",
    pa.completed_pickup_medicine_stamp as "Obat Telah Selesai",
    da.queue_number as "Nomor Antrian",
    -- ✅ Simple daily queue position
    (SELECT COUNT(*) 
     FROM Doctor_Appointments da2 
     LEFT JOIN Verification_Task vt2 ON da2.NOP = vt2.NOP
     WHERE vt2.completed_verification_stamp IS NULL
     AND da2.lokasi = da.lokasi
     AND DATE(vt2.waiting_verification_stamp) = DATE(vt.waiting_verification_stamp)
     AND vt2.waiting_verification_stamp < vt.waiting_verification_stamp
    ) + 1 AS current_position,
    DATE(vt.waiting_verification_stamp) as "Tanggal Antrian",
    da.NOP,
    da.status_medicine
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE da.NOP = ?                                                                                                                             
ORDER BY vt.waiting_verification_stamp DESC;`;
      const [rows] = await conn.execute(query, [NOP]);
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