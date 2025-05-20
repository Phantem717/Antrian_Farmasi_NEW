let io;

module.exports = {
  init: (server) => {
    const { Server } = require('socket.io');
    io = new Server(server, {
      cors: {
        origin: "http://172.16.21.214:3009", // Change to frontend IP in production
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        credentials: true,
      },
      pingTimeout: 20000,
      pingInterval: 5000,
      transports: ["websocket", "polling"],
    });

    console.log('? Socket.IO initialized');

    // ? Tambahkan listener untuk koneksi baru
    io.on('connection', (socket) => {
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
