// socket.js
import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io('http://172.16.21.214:5000', {
      reconnection: true,
      transports: ['websocket'],
      pingTimeout: 20000,
      pingInterval: 50000,
    });
  }
  return socket;
};
