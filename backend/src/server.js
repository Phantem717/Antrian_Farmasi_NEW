// src/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors"); // 🔥 Tambahkan CORS
const { initDb } = require('./config/db');
const { setupDatabase } = require('./setupDatabase');

const app = express();
const server = http.createServer(app);

//SOCKET
const socketConfig = require('./config/socket'); // ? Import socket setup
const io = socketConfig.init(server);
app.set('socketio',io);


const doctorAppointmentsRoutes = require('./routes/doctorAppointments');
const BarcodeRoutes = require('./routes/BarcodeRoutes');
const loketRoutes = require('./routes/loketRoutes');
const verificationTaskRoutes = require('./routes/verificationTaskRoutes');
const medicineTaskRoutes = require('./routes/medicineTaskRoutes');
const pickupTaskRoutes = require('./routes/pickupTaskRoutes');
const pharmacyTaskRoutes = require('./routes/pharmacyTaskRoutes');
const ButtonRoutes = require('./routes/ButtonRoutes');
const logsRoutes = require('./routes/logsRoutes');
const responsesRoutes = require('./routes/responsesRoutes');
const waRoutes = require('./routes/WaRoutes');
const printRoutes = require('./routes/printRoutes');
const queueRoutes = require('./routes/createAntrianRoute');
const loginRoutes = require('../src/routes/loginRoutes');
(async function startServer() {
  try {
    await initDb();
    await setupDatabase();
  } catch (error) {
    console.error('Gagal inisialisasi database:', error);
    process.exit(1);
  }

  // Middleware untuk parsing JSON dan CORS
  app.use(express.json());
  app.use(cors({ origin: "*" })); // 🔥 Izinkan akses dari mana saja

  // Daftarkan route
  app.use('/api/doctor-appointments', doctorAppointmentsRoutes);
  app.use('/api/bpjs', BarcodeRoutes);
  app.use('/api/loket', loketRoutes);
  app.use('/api/verification-task', verificationTaskRoutes);
  app.use('/api/medicine-task', medicineTaskRoutes);
  app.use('/api/pickup-task', pickupTaskRoutes);
  app.use('/api/pharmacy-tasks', pharmacyTaskRoutes);
  app.use('/api/button', ButtonRoutes);
  app.use('/api/logs',logsRoutes);
  app.use('/api/responses',responsesRoutes);
  app.use('/api/send',waRoutes);
  app.use('/api/print',printRoutes);
  app.use('/api/queue',queueRoutes);
app.use('/api/login',loginRoutes);
  // Menjalankan server pada semua network interfaces
  const HOST = process.env.HOST || '172.16.21.214'; // 🔥 Pastikan server bisa diakses dari IP lain
  const PORT = process.env.PORT || 5000;

  server.listen(PORT, HOST, () => {
    console.log(`✅ Server berjalan pada ${HOST}:${PORT}`);
  });
})();
