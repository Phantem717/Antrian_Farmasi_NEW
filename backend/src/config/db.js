// src/config/db.js
const mysql = require('mysql2/promise');
    require('dotenv').config();

const dbConfig = {
host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: '',
        database: process.env.DB_NAME, // nama database yang ingin digunakan
};

let connection;

/**
 * Inisialisasi koneksi ke database.
 * Jika database belum ada, akan dibuat terlebih dahulu.
 */
async function initDb() {
  try {
    // Pertama, koneksikan ke server MySQL tanpa database tertentu
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    // Buat database jika belum ada
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log(`Database '${dbConfig.database}' sudah dibuat atau sudah ada.`);
    await tempConnection.end();

    // Sekarang, koneksikan ke database yang sudah ada
    connection = await mysql.createConnection(dbConfig);
    console.log('Koneksi ke MySQL berhasil');
  } catch (error) {
    console.error('Error menghubungkan ke MySQL:', error);
    process.exit(1);
  }
}

/**
 * Mendapatkan instance koneksi yang sudah diinisialisasi.
 */
function getDb() {
  if (!connection) {
    throw new Error("Database belum diinisialisasi!");
  }
  return connection;
}

module.exports = {
  initDb,
  getDb,
};
