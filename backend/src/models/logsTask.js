// src/models/verificationTask.js
const { getDb } = require('../config/db');

class logsTask {
  /**
   * Mengambil semua data log lengkap dari berbagai task berdasarkan NOP.
   */
  static async getAll() {
     let connection;

    try {
      const pool = await getDb();      connection = await pool.getConnection();
      const query = `
      SELECT 
    da.NOP,
    da.patient_name,
    da.queue_number,
    da.sep_no,
    da.medical_record_no,
    da.status_medicine,
    

    pa.waiting_pickup_medicine_stamp,
    pa.called_pickup_medicine_stamp,
    pa.recalled_pickup_medicine_stamp,
    pa.pending_pickup_medicine_stamp,
    pa.completed_pickup_medicine_stamp,
    

    pt.status,
    

    mt.waiting_medicine_stamp,
    mt.completed_medicine_stamp,
    

    vt.waiting_verification_stamp,
    vt.called_verification_stamp,
    vt.recalled_verification_stamp,
    vt.pending_verification_stamp,
    vt.processed_verification_stamp,
    vt.completed_verification_stamp,
    

   TIMESTAMPDIFF(
        MINUTE, 
        vt.completed_verification_stamp, 
        CASE 
            WHEN pa.called_pickup_medicine_stamp IS NOT NULL 
            THEN pa.called_pickup_medicine_stamp
            
            ELSE pa.completed_pickup_medicine_stamp
        END
    ) AS verification_to_pickup_minutes
    
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
ORDER BY vt.waiting_verification_stamp;  `;

      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getToday() {
     let connection;

    try {
      const pool = await getDb();      connection = await pool.getConnection();
      const query = `
      SELECT 
    da.NOP,
    da.patient_name,
    da.queue_number,
    da.sep_no,
    da.medical_record_no,
    da.status_medicine,
    pa.waiting_pickup_medicine_stamp,
    pa.called_pickup_medicine_stamp,
    pa.recalled_pickup_medicine_stamp,
    pa.pending_pickup_medicine_stamp,
    pa.completed_pickup_medicine_stamp,
    pt.status,
    mt.waiting_medicine_stamp,
    mt.completed_medicine_stamp,
    vt.waiting_verification_stamp,
    vt.called_verification_stamp,
    vt.recalled_verification_stamp,
    vt.pending_verification_stamp,
    vt.processed_verification_stamp,
    vt.completed_verification_stamp,
   TIMESTAMPDIFF(
        MINUTE, 
        vt.completed_verification_stamp, 
        CASE 
            WHEN pa.called_pickup_medicine_stamp IS NOT NULL 
            THEN pa.called_pickup_medicine_stamp
            
            ELSE pa.completed_pickup_medicine_stamp
        END
    ) AS verification_to_pickup_minutes
    
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE Date(vt.waiting_verification_stamp) = CURRENT_DATE
ORDER BY vt.waiting_verification_stamp;  `;

      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }
static async getByTimePeriod(period) {
   let connection;

    try {
      const pool = await getDb();      connection = await pool.getConnection();
        
        // Define date conditions based on period
        let dateCondition;
        switch(period.toLowerCase()) {
            case 'minggu':
                dateCondition = "YEARWEEK(vt.waiting_verification_stamp, 1) = YEARWEEK(CURDATE(), 1)";
                break;
            case 'bulan_ini':
                dateCondition = "MONTH(vt.waiting_verification_stamp) = MONTH(CURDATE()) AND YEAR(vt.waiting_verification_stamp) = YEAR(CURDATE())";
                break;
            case '3_bulan':
                dateCondition = "vt.waiting_verification_stamp >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)";
                break;
            case '6_bulan':
                dateCondition = "vt.waiting_verification_stamp >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)";
                break;
            case 'tahun_ini':
                dateCondition = "YEAR(vt.waiting_verification_stamp) = YEAR(CURDATE())";
                break;
            default: // today
                dateCondition = "DATE(vt.waiting_verification_stamp) = CURDATE()";
        }

        const query = `
        SELECT 
            da.NOP,
            da.patient_name,
            da.queue_number,
            da.sep_no,
            da.medical_record_no,
            da.status_medicine,
            pa.waiting_pickup_medicine_stamp,
            pa.called_pickup_medicine_stamp,
            pa.recalled_pickup_medicine_stamp,
            pa.pending_pickup_medicine_stamp,
            pa.completed_pickup_medicine_stamp,
            pt.status,
            mt.waiting_medicine_stamp,
            mt.completed_medicine_stamp,
            vt.waiting_verification_stamp,
            vt.called_verification_stamp,
            vt.recalled_verification_stamp,
            vt.pending_verification_stamp,
            vt.processed_verification_stamp,
            vt.completed_verification_stamp,
            TIMESTAMPDIFF(
                MINUTE, 
                vt.completed_verification_stamp, 
                CASE 
                    WHEN pa.called_pickup_medicine_stamp IS NOT NULL 
                    THEN pa.called_pickup_medicine_stamp
                    ELSE pa.completed_pickup_medicine_stamp
                END
            ) AS verification_to_pickup_minutes
        FROM Doctor_Appointments da
        LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
        LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
        LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
        LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
        WHERE ${dateCondition}
        ORDER BY vt.waiting_verification_stamp;`;

        const [rows] = await pool.execute(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Usage examples:
// await getByTimePeriod('today');
// await getByTimePeriod('thisweek');
// await getByTimePeriod('thismonth');
// await getByTimePeriod('3months');
// await getByTimePeriod('6months');
// await getByTimePeriod('thisyear');
static async getByDate(date) {
   let connection;

    try {
      const pool = await getDb();      connection = await pool.getConnection();
      const query = `
      SELECT 
    da.NOP,
    da.patient_name,
    da.queue_number,
    da.sep_no,
    da.medical_record_no,
    da.status_medicine,
    pa.waiting_pickup_medicine_stamp,
    pa.called_pickup_medicine_stamp,
    pa.recalled_pickup_medicine_stamp,
    pa.pending_pickup_medicine_stamp,
    pa.completed_pickup_medicine_stamp,
    pt.status,
    mt.waiting_medicine_stamp,
    mt.completed_medicine_stamp,
    vt.waiting_verification_stamp,
    vt.called_verification_stamp,
    vt.recalled_verification_stamp,
    vt.pending_verification_stamp,
    vt.processed_verification_stamp,
    vt.completed_verification_stamp,
   TIMESTAMPDIFF(
        MINUTE, 
        vt.completed_verification_stamp, 
        CASE 
            WHEN pa.called_pickup_medicine_stamp IS NOT NULL 
            THEN pa.called_pickup_medicine_stamp
            
            ELSE pa.completed_pickup_medicine_stamp
        END
    ) AS verification_to_pickup_minutes
    
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE Date(vt.waiting_verification_stamp) = ?
ORDER BY vt.waiting_verification_stamp;  `;

      const [rows] = await pool.execute(query, [date]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getTotalMedicineType(){
   let connection;

    try {
      const pool = await getDb();      connection = await pool.getConnection();
      const query = `  
      SELECT 
    da.status_medicine,
    COUNT(DISTINCT da.NOP) as booking_count

FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP

WHERE pt.medicine_type LIKE 'Non - Racikan' OR pt.medicine_type LIKE 'Racikan'
GROUP BY da.status_medicine`;
          const [rows] = await pool.execute(query);
          return rows;
    } catch (error) {
      return error;
    }
   
  }

   static async getTodayMedicineType(){
     let connection;

    try {
      const pool = await getDb();      connection = await pool.getConnection();
      const query = `  
      SELECT 
    AVG(CASE WHEN da.status_medicine = 'Racikan' 
             THEN TIMESTAMPDIFF(MINUTE, vt.waiting_verification_stamp, pa.completed_pickup_medicine_stamp) 
             ELSE NULL END) AS 'AVG PROCESSING TIME - RACIKAN (MINUTES)',
    AVG(CASE WHEN da.status_medicine != 'Racikan' OR da.status_medicine IS NULL
             THEN TIMESTAMPDIFF(MINUTE, vt.waiting_verification_stamp, pa.completed_pickup_medicine_stamp) 
             ELSE NULL END) AS 'AVG PROCESSING TIME - NON-RACIKAN (MINUTES)'
    
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE pt.medicine_type LIKE 'Non - Racikan' OR pt.medicine_type LIKE 'Racikan'
`;
          const [rows] = await pool.execute(query);
          return rows;
    } catch (error) {
      return error;
    }
   
  }

  static async getAvgServiceTime(){
     let connection;

    try {
      const pool = await getDb();      connection = await pool.getConnection();
      const query = `SELECT 
    AVG(CASE WHEN da.status_medicine = 'Racikan' 
             THEN TIMESTAMPDIFF(MINUTE, vt.waiting_verification_stamp, pa.completed_pickup_medicine_stamp) 
             ELSE NULL END) AS 'AVG PROCESSING TIME - RACIKAN (MINUTES)',
    AVG(CASE WHEN da.status_medicine != 'Racikan' OR da.status_medicine IS NULL
             THEN TIMESTAMPDIFF(MINUTE, vt.waiting_verification_stamp, pa.completed_pickup_medicine_stamp) 
             ELSE NULL END) AS 'AVG PROCESSING TIME - NON-RACIKAN (MINUTES)'
    
FROM Doctor_Appointments da
LEFT JOIN Verification_Task vt ON da.NOP = vt.NOP
LEFT JOIN Pharmacy_Task pt ON da.NOP = pt.NOP
LEFT JOIN Medicine_Task mt ON da.NOP = mt.NOP
LEFT JOIN Pickup_Task pa ON da.NOP = pa.NOP
WHERE pt.status = 'completed_pickup_medicine'
  `;
  
  const [rows] = await pool.execute(query);
  return rows;
    } catch (error) {
      return error;
    }
   

  }

  static async getDataPerHour() {
      let connection;

    try {
      const pool = await getDb();      connection = await pool.getConnection();


      const query = `SELECT 
      HOUR(completed_pickup_medicine_stamp) AS hour_of_day,
      COUNT(*) AS record_count
  FROM Pickup_Task
  WHERE completed_pickup_medicine_stamp IS NOT NULL
   
  GROUP BY HOUR(completed_pickup_medicine_stamp)
  ORDER BY hour_of_day`;
  const [rows] = await pool.execute(query);
  return rows;
    } catch (error) {
      return error;

    }
   
  }
}

module.exports = logsTask;
