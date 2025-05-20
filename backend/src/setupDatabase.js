// backend_farmasi/src/setupDatabase.js
// src/setupDatabase.js
const { getDb } = require('./config/db');

const queries = [
  // Tabel Doctor_Appointments
  `CREATE TABLE IF NOT EXISTS Doctor_Appointments (
    booking_id VARCHAR(50) PRIMARY KEY,
    sep_no VARCHAR(50),
    queue_number VARCHAR(20),
    queue_status VARCHAR(20),
    queue_type VARCHAR(50),
    patient_name VARCHAR(100),
    medical_record_no VARCHAR(50)
  );`,

  // Tabel Pharmacy_Task
  `CREATE TABLE IF NOT EXISTS Pharmacy_Task (
    booking_id VARCHAR (50) PRIMARY KEY,
    status VARCHAR(20),
    medicine_type VARCHAR(50)
  );`,

  // Tabel Verification_Task (menggunakan booking_id sebagai PK & FK)
  `CREATE TABLE IF NOT EXISTS Verification_Task (
    booking_id VARCHAR(50) PRIMARY KEY,
    Executor VARCHAR(50),
    Executor_Names VARCHAR(150),
    waiting_verification_stamp TIMESTAMP,
    called_verification_stamp TIMESTAMP,
    recalled_verification_stamp TIMESTAMP,
    pending_verification_stamp TIMESTAMP,
    processed_verification_stamp TIMESTAMP,
    completed_verification_stamp TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES Pharmacy_Task(booking_id)
    ON DELETE CASCADE ON UPDATE CASCADE
  );`,
  
  // Tabel Medicine_Task (menggunakan booking_id sebagai PK & FK)
  `CREATE TABLE IF NOT EXISTS Medicine_Task (
    booking_id VARCHAR(50) PRIMARY KEY,
    Executor VARCHAR(50),
    Executor_Names VARCHAR(150),
    waiting_medicine_stamp TIMESTAMP,
    called_medicine_stamp TIMESTAMP,
    recalled_medicine_stamp TIMESTAMP,
    pending_medicine_stamp TIMESTAMP,
    processed_medicine_stamp TIMESTAMP,
    completed_medicine_stamp TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES Pharmacy_Task(booking_id)
    ON DELETE CASCADE ON UPDATE CASCADE
  );`,

  // Tabel Pickup_Task (menggunakan booking_id sebagai PK & FK)
  `CREATE TABLE IF NOT EXISTS Pickup_Task (
    booking_id VARCHAR(50) PRIMARY KEY,
    Executor VARCHAR(50),
    Executor_Names VARCHAR(150),
    waiting_pickup_medicine_stamp TIMESTAMP,
    called_pickup_medicine_stamp TIMESTAMP,
    recalled_pickup_medicine_stamp TIMESTAMP,
    pending_pickup_medicine_stamp TIMESTAMP,
    processed_pickup_medicine_stamp TIMESTAMP,
    completed_pickup_medicine_stamp TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES Pharmacy_Task(booking_id)
    ON DELETE CASCADE ON UPDATE CASCADE
  );`,

  // Tabel Loket
  `CREATE TABLE IF NOT EXISTS Loket (
    loket_id INT AUTO_INCREMENT PRIMARY KEY,
    loket_name VARCHAR(100),
    Executor VARCHAR(50),
    Executor_Names VARCHAR(150),
    description TEXT,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );`
];

async function setupDatabase() {
  try {
    const connection = getDb();
    for (const [i, query] of queries.entries()) {
      await connection.execute(query);
      console.log(`Query ${i + 1} berhasil dieksekusi.`);
    }
    console.log('Setup database selesai.');
  } catch (error) {
    console.error('Error saat setup database:', error);
    throw error;
  }
}

module.exports = { setupDatabase };
