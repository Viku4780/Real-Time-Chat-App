import http from 'http';
import express from 'express';
import { ENV } from '../../config/env.js';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import User from '../auth/auth.model.js'
import { userSocketMap } from './store/websocket.store.js';
import { broadCastOnlineUsers, getSocket } from './utils/websocket.utils.js';
import { socketAuth } from './middleware/websocketAuth.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", socketAuth(async (socket, req) => {
 console.log('websocket authenticated successfully');

 userSocketMap.set(socket.userId, socket);
 console.log('broadcasting happening')
 broadCastOnlineUsers(userSocketMap);

 socket.on("close", () => {
   //  console.log('running close event in websocket')
    userSocketMap.delete(socket.userId);
    broadCastOnlineUsers(userSocketMap);
 })
}));

export { wss, app, server };