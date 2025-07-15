let io;
require('dotenv').config({ path: './.env' }); // Or just require('dotenv').config();

const responseControl = require('../controllers/responsesController');
const medControl = require('../models/medicineTask')
const pickupControl = require('../models/pickupTask');
const VerificationTask = require('../models/verificationTask');
const verifControl = require('../models/verificationTask')
module.exports = {
  init: (server) => {
    const { Server } = require('socket.io');
    const HOST = process.env.FE_HOST;
    const PORT = process.env.FE_PORT
    io = new Server(server, {
      cors: {
        origin: `http://${HOST}:${PORT}`, // Change to frontend IP in production
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        credentials: true,
      },
      pingTimeout: 20000,
      pingInterval: 5000,
      transports: ["websocket", "polling"],
    });

    console.log('? Socket.IO initialized');

    
    // ? Tambahkan listener untuk koneksi baru
    io.on('connection', async (socket) => {
     const getData = async () => {
    try {
      const data = await responseControl.getAllResponses("Lantai 1 BPJS");
      socket.emit('get_responses', {
        message: '? Initial data fetched',
        data: data
      });
            console.log("GET RESPONSE");

    } catch (err) {
      console.error('? Error fetching responses:', err.message);
      socket.emit('get_responses', {
        message: '? Failed to fetch data',
        error: err.message
      });
    }
  };
      getData();
socket.on('update_display', async () => {
  console.log("ON UPDATE"); // ?? Pastikan handler dipanggil
try {
      const data = await responseControl.getAllResponses("Lantai 1 BPJS");
      io.emit('get_responses', {
        message: '? Initial data fetched',
        data: data
      });
            // console.log("GET RESPONSE");

    } catch (err) {
      console.error('? Error fetching responses:', err.message);
      io.emit('get_responses', {
        message: '? Failed to fetch data',
        error: err.message
      });
    }});      
    
    socket.on('update_proses', async () => {
      try {
      const data = await medControl.getMedicineToday();
      io.emit('get_responses_proses', {
        message: '? Initial data fetched',
        data: data
      });

      io.emit('update_daftar_proses');
            console.log("GET RESPONSE");

    } catch (err) {
      console.error('? Error fetching responses:', err.message);
      io.emit('get_responses_proses', {
        message: '? Failed to fetch data',
        error: err.message
      });
    }
    });

    socket.on('update_verif', async ()=>{
      try {
      const data = await VerificationTask.getAll();
      io.emit('get_responses_verif', {
        message: '? Initial data fetched',
        data: data
      });

      io.emit('update_daftar_verif');
            console.log("GET RESPONSE");

    } catch (err) {
      console.error('? Error fetching responses:', err.message);
      io.emit('get_responses_verif', {
        message: '? Failed to fetch data',
        error: err.message
      });
    }
    });

    
    socket.on('update_pickup', async () => {
      try {
      const data = await pickupControl.getPickupToday();
      io.emit('get_responses_pickup', {
        message: '? Initial data fetched',
        data: data
      });
            console.log("GET RESPONSE");
      
            io.emit('update_daftar_pickup');


    } catch (err) {
      console.error('? Error fetching responses:', err.message);
      io.emit('get_responses_pickup', {
        message: '? Failed to fetch data',
        error: err.message
      });
    }
    });

    socket.on('update_latest_pickup', (payload) => {
      console.log("PAYLOAD",payload.message,payload.data);
      io.emit('send_latest_pickup', {
        message: payload.message,
        data: payload.data
      });
    })
    console.log('?? Client connected:', socket.id);

      // Listener uji coba
        socket.emit("test_ping", { message: "? Server is alive!" });
    

      socket.on("test_ping", (message) => {
        console.log("?? Received test_ping:", message);
        socket.emit("test_pong", { message: "? Server is alive!" });
      });

      socket.on("disconnect", () => {
        console.log("? Client disconnected:", socket.id);
      });
      let queueDataBPJS = [];
      let queueDataGMCB = [];
      let queueDataLT3 = [];

      socket.on('call_queues_verif', (payload) => {
        // queueData.push(payload.data);
        console.log("QUEUES VERIF", payload.data);
      
        // Emit updated queue to frontend
        // io.emit('send_queues_verif_frontend_BPJS', { data: queueData });
        if(payload.lokasi == "Lantai 1 BPJS"){
          console.log("VERIF BPJS");
          queueDataBPJS.push(payload.data);
          io.emit('send_queues_verif_frontend_BPJS', { data: queueDataBPJS });

        }
        if(payload.lokasi == "Lantai 3 GMCB"){
          queueDataLT3.push(payload.data);

          io.emit('send_queues_verif_frontend_LT3', { data: queueDataLT3 });

        }
        if(payload.lokasi == "Lantai 1 GMCB"){
          queueDataGMCB.push(payload.data);

          io.emit('send_queues_verif_frontend_GMCB', { data: queueDataGMCB });

        }
        queueDataBPJS = [];
        queueDataLT3 = [];
        queueDataGMCB = [];

      });
      const defaultLocation = "Lantai 1 BPJS";


         
     
 
      
      socket.on('call_queues_pickup', (payload) => {
        if(payload.lokasi == "Lantai 1 BPJS"){
          queueDataBPJS.push(payload.data);
          io.emit('send_queues_pickup_frontend_BPJS', { data: queueDataBPJS });

        }
        if(payload.lokasi == "Lantai 3 GMCB"){
          queueDataLT3.push(payload.data);

          io.emit('send_queues_pickup_frontend_LT3', { data: queueDataLT3 });

        }
        if(payload.lokasi == "Lantai 1 GMCB"){
          queueDataGMCB.push(payload.data);

          io.emit('send_queues_pickup_frontend_GMCB', { data: queueDataGMCB });

        }
        console.log("QUEUES PICKUP", payload.data);
      
        // Emit updated queue to frontend
        queueDataBPJS = [];
        queueDataLT3 = [];
        queueDataGMCB = [];

      });
      // queueData = [];
      // console.log("QUEUEDATA",queueData);
    });

    return io;
  },

  getIO: () => {
    if (!io) throw new Error("Socket.IO belum diinisialisasi!");
    return io;
  }
};
