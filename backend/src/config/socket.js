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
    console.log(HOST,PORT);
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
     const getData = async (location) => {
    console.log("SOCKET LCOATION",location);
    try {
      if(location == "bpjs"){
        location = "Lantai 1 BPJS"
      }
      if(location == "gmcb"){
        location = "Lantai 1 GMCB"
      }
      if(location == "lt3"){
        location = "Lantai 3 GMCB"
      }
      const data = await responseControl.getAllResponses(location);
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

  socket.on('get_initial_responses_pickup', async (payload) => {
    
try {
  let location = payload.location;
    if(location == "bpjs"){
        location = "Lantai 1 BPJS"
      }
      if(location == "gmcb"){
        location = "Lantai 1 GMCB"
      }
      if(location == "lt3"){
        location = "Lantai 3 GMCB"
      }
  console.log("ON UPDATE"); // ?? Pastikan handler dipanggil
      const data = await responseControl.getAllResponses(location);
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
    }
  });

  socket.on('get_initial_responses', async (payload) => {
    const data =await getData(payload.location);
try {
  let location = payload.location;
    if(location == "bpjs"){
        location = "Lantai 1 BPJS"
      }
      if(location == "gmcb"){
        location = "Lantai 1 GMCB"
      }
      if(location == "lt3"){
        location = "Lantai 3 GMCB"
      }
      const data = await responseControl.getAllResponses(location);
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
    }}
    );
socket.on('update_display', async (payload) => {
  console.log("PAYLOAD",payload);
try {
  let location = payload.location;
    if(location == "bpjs"){
        location = "Lantai 1 BPJS"
      }
      if(location == "gmcb"){
        location = "Lantai 1 GMCB"
      }
      if(location == "lt3"){
        location = "Lantai 3 GMCB"
      }
  console.log("ON UPDATE",location); // ?? Pastikan handler dipanggil
      const data = await responseControl.getAllResponses(location);
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
    
    socket.on('update_proses', async (payload) => {
      
      try {
          let location = payload.location;
    if(location == "bpjs"){
        location = "Lantai 1 BPJS"
      }
      if(location == "gmcb"){
        location = "Lantai 1 GMCB"
      }
      if(location == "lt3"){
        location = "Lantai 3 GMCB"
      }
  console.log("ON UPDATE"); // ?? Pastikan handler dipanggil
      const data = await medControl.getMedicineToday(location);
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

    socket.on('update_verif', async (payload)=>{
      try {
          let location = payload.location;
    if(location == "bpjs"){
        location = "Lantai 1 BPJS"
      }
      if(location == "gmcb"){
        location = "Lantai 1 GMCB"
      }
      if(location == "lt3"){
        location = "Lantai 3 GMCB"
      }
  console.log("ON UPDATE",location); // ?? Pastikan handler dipanggil
      const data = await VerificationTask.getToday(location);
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

    
    socket.on('update_pickup', async (payload) => {
      try {
          let location = payload.location;
          console.log("LOC",location);
    if(location == "bpjs"){
        location = "Lantai 1 BPJS"
      }
      if(location == "gmcb"){
        location = "Lantai 1 GMCB"
      }
      if(location == "lt3"){
        location = "Lantai 3 GMCB"
      }

  console.log("ON UPDATE"); // ?? Pastikan handler dipanggil
      const data = await pickupControl.getPickupToday(location);
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

    socket.on('toggleName', (payload) => {
      console.log("PAYLOAD",payload.message,payload.data);
      io.emit('send_nameToggle', {
        message: payload.message,
        data: payload.data
      });
    })
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
