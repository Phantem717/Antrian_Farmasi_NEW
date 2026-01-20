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
    const mapLocation = (location) => {
      if (location === "bpjs" || location === "Lantai 1 BPJS") return "Lantai 1 BPJS";
      if (location === "gmcb" || location === "Lantai 1 GMCB") return "Lantai 1 GMCB";
      if (location === "lt3" || location === "Lantai 3 GMCB") return "Lantai 3 GMCB";
      return location;
    };
    
    // ? Tambahkan listener untuk koneksi baru
    io.on('connection', async (socket) => {

      socket.on('join_room', (payload) => {
        const { location } = payload;
        const roomName = `room_${location}`;
        
        socket.join(roomName);
        console.log(`🚪 Client ${socket.id} joined room: ${roomName}`);
      });

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
                  console.log("PAYLOAD INITIAL PICKUP", payload);

            if(payload.location == "Lantai 1 BPJS"){
            payload.location = "bpjs"
          }
          if(payload.location == "Lantai 1 GMCB"){
            payload.location = "gmcb"
          }
          if(payload.location == "Lantai 3 GMCB"){
            payload.location = "lt3"
          }

          const location = payload.location;
          const roomName = `room_${location}`;
          const mappedLocation = mapLocation(location);
          
          socket.join(roomName);
          
          const data = await responseControl.getAllResponses(mappedLocation);
          
          io.to(roomName).emit('get_responses', {
            message: '✅ Initial data fetched',
            data: data
          });
        } catch (err) {
          console.error('❌ Error:', err.message);
        }
      });

 socket.on('get_initial_responses', async (payload) => {
        try {
                  console.log("PAYLOAD", payload);

            if(payload.location == "Lantai 1 BPJS"){
            payload.location = "bpjs"
          }
          if(payload.location == "Lantai 1 GMCB"){
            payload.location = "gmcb"
          }
          if(payload.location == "Lantai 3 GMCB"){
            payload.location = "lt3"
          }
          const location = payload.location;
          const roomName = `room_${location}`;
          const mappedLocation = mapLocation(location);
          
          // Join room
          socket.join(roomName);
          
          const data = await responseControl.getAllResponses(mappedLocation);
          
          // ✅ Send only to this room
          io.to(roomName).emit('get_responses', {
            message: '✅ Initial data fetched',
            data: data
          });
          
          console.log(`📤 Sent initial responses to room: ${roomName}`);
        } catch (err) {
          console.error('❌ Error fetching responses:', err.message);
          socket.emit('get_responses', {
            message: '❌ Failed to fetch data',
            error: err.message
          });
        }
      });

socket.on('update_display', async (payload) => {
        console.log("PAYLOAD", payload);
        try {
          if(payload.location == "Lantai 1 BPJS"){
            payload.location = "bpjs"
          }
          if(payload.location == "Lantai 1 GMCB"){
            payload.location = "gmcb"
          }
          if(payload.location == "Lantai 3 GMCB"){
            payload.location = "lt3"
          }
          const location = payload.location;
          const roomName = `room_${location}`;
          const mappedLocation = mapLocation(location);
          
          console.log("ON UPDATE", mappedLocation, "to room", roomName);
          
          const data = await responseControl.getAllResponses(mappedLocation);
          
          // ✅ Only send to this location's room
          io.to(roomName).emit('get_responses', {
            message: '✅ Initial data fetched',
            data: data
          });
        } catch (err) {
          console.error('❌ Error:', err.message);
        }
      });
    
    socket.on('update_proses', async (payload) => {
        try {
                      console.log("PAYLOAD", payload);

          if(payload.location == "Lantai 1 BPJS"){
            payload.location = "bpjs"
          }
          if(payload.location == "Lantai 1 GMCB"){
            payload.location = "gmcb"
          }
          if(payload.location == "Lantai 3 GMCB"){
            payload.location = "lt3"
          }
          const location = payload.location;
          const roomName = `room_${location}`;
          const mappedLocation = mapLocation(location);
          
          const data = await medControl.getMedicineToday(mappedLocation);
          
          io.to(roomName).emit('get_responses_proses', {
            message: '✅ Initial data fetched',
            data: data
          });

          io.to(roomName).emit('update_daftar_proses');
          
          console.log(`📤 Sent proses update to room: ${roomName}`);
        } catch (err) {
          console.error('❌ Error:', err.message);
        }
      });
socket.on('update_verif', async (payload) => {
        try {
                  console.log("PAYLOAD", payload);

              if(payload.location == "Lantai 1 BPJS"){
            payload.location = "bpjs"
          }
          if(payload.location == "Lantai 1 GMCB"){
            payload.location = "gmcb"
          }
          if(payload.location == "Lantai 3 GMCB"){
            payload.location = "lt3"
          }
          const location = payload.location;
          const roomName = `room_${location}`;
          const mappedLocation = mapLocation(location);
          
          console.log("ON UPDATE", mappedLocation, "to room", roomName);
          
          const data = await VerificationTask.getToday(mappedLocation);
          
          io.to(roomName).emit('get_responses_verif', {
            message: '✅ Initial data fetched',
            data: data
          });

          io.to(roomName).emit('update_daftar_verif');
          
          console.log(`📤 Sent verif update to room: ${roomName}`);
        } catch (err) {
          console.error('❌ Error:', err.message);
        }
      });
    
    socket.on('update_pickup', async (payload) => {
        try {
                  console.log("PAYLOAD", payload);

              if(payload.location == "Lantai 1 BPJS"){
            payload.location = "bpjs"
          }
          if(payload.location == "Lantai 1 GMCB"){
            payload.location = "gmcb"
          }
          if(payload.location == "Lantai 3 GMCB"){
            payload.location = "lt3"
          }
          const location = payload.location;
          const roomName = `room_${location}`;
          const mappedLocation = mapLocation(location);
          
          console.log("LOC", location, "to room", roomName);
          
          const data = await pickupControl.getPickupToday(mappedLocation);
          
          io.to(roomName).emit('get_responses_pickup', {
            message: '✅ Initial data fetched',
            data: data
          });

          io.to(roomName).emit('update_daftar_pickup');
          
          console.log(`📤 Sent pickup update to room: ${roomName}`);
        } catch (err) {
          console.error('❌ Error:', err.message);
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
        console.log("QUEUES VERIF", payload);
        
        if (payload.lokasi === "Lantai 1 BPJS") {
          console.log("VERIF BPJS");
          io.emit('send_queues_verif_frontend_BPJS', { 
            data: payload.data,
            message: "Call verification" 
          });
        }
        else if (payload.lokasi === "Lantai 3 GMCB") {
          io.emit('send_queues_verif_frontend_LT3', { 
            data: payload.data,
            message: "Call verification" 
          });
        }
        else if (payload.lokasi === "Lantai 1 GMCB") {
          console.log("GMCB CALL");
          io.emit('send_queues_verif_frontend_GMCB', { 
            data: payload.data,
            message: "Call verification" 
          });
        }
      });

  socket.on('call_queues_pickup', (payload) => {
        console.log("PAYLOAD PICKUP", payload);
        const data = payload.data;
        
        if (payload.lokasi === "Lantai 1 BPJS") {
          console.log("TEST PICKUP BPJS", payload.lokasi);
          io.emit('send_queues_pickup_frontend_BPJS', { 
            data: data,
            message: "Call pickup" 
          });
        }
        else if (payload.lokasi === "Lantai 3 GMCB") {
          io.emit('send_queues_pickup_frontend_LT3', { 
            data: data,
            message: "Call pickup" 
          });
        }
        else if (payload.lokasi === "Lantai 1 GMCB") {
          console.log("TEST PICKUP GMCB", payload.lokasi);
          console.log("DATA", data);
          io.emit('send_queues_pickup_frontend_GMCB', { 
            data: data,
            message: "Call pickup" 
          });
          console.log("SEND PICKUP");
        }
      });
      const defaultLocation = "Lantai 1 BPJS";

    
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
