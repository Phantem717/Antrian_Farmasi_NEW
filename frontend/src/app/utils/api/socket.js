// socket.js
import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io('http://192.168.6.106:5000', {
      reconnection: true,
      transports: ['websocket'],
      pingTimeout: 20000,
      pingInterval: 50000,
    });
  }
  return socket;
};
