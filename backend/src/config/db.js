// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let pool;

async function initDb() {
  try {
    // Step 1: Connect without DB
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    console.log(`Database '${dbConfig.database}' dibuat atau sudah ada.`);
    await tempConnection.end();

    // Step 2: Create pool with DB
    pool = mysql.createPool({
 host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
      connectionLimit: 10,
      enableKeepAlive: true,
    });
console.log("? Pool created successfully");

    // Test connection from pool
  } catch (error) {
    console.error("? Error menghubungkan ke MySQL:", error);
    process.exit(1);
  }
}
async function getDb() {
  if (!pool) {
    console.error("? Pool not initialized");
    throw new Error("Database belum diinisialisasi!");
  }
  console.log("? getDb() called");
  return pool;
}

module.exports = {
  initDb,
  getDb,
};
