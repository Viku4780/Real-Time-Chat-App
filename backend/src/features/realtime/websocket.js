import http from 'http';
import express from 'express';
import { ENV } from '../../config/env.js';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import User from '../auth/auth.model.js'
import { userSocketMap } from './store/websocket.store.js';
import { broadCastOnlineUsers, getSocket, resolveMessageDelivery } from './utils/websocket.utils.js';
import { socketAuth } from './middleware/websocketAuth.js';
import { messageQueue } from '../../store/messageQueue.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", socketAuth(async (socket, req) => {
  console.log('websocket authenticated successfully');

  // console.log('userId: ', userId);
  userSocketMap.set(socket.userId, socket);
  broadCastOnlineUsers(userSocketMap);


  if (messageQueue.get(socket.userId)) {
    const queueMessage = messageQueue.get(socket.userId);

    console.log('running messageQueue');

    queueMessage.forEach(async(msg) => {
      const socket = getSocket(msg.senderId.toString());
      console.log('socket', socket);
      await resolveMessageDelivery(msg ,socket);
    })
  }

  socket.on("close", () => {
    userSocketMap.delete(socket.userId);
    broadCastOnlineUsers(userSocketMap);
  })
}));

export { wss, app, server };