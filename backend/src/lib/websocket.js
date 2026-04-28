// import {Server} from 'socket.io';
import http from 'http';
import express from 'express';
import { ENV } from './env.js';
import jwt from 'jsonwebtoken';
import { WebSocketServer } from 'ws';
import { type } from 'os';
import User from '../models/User.js'


const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

export function getReceiverSocket(id) {
    return userSocketMap.get(id);
}

//  this is for storing online users
const userSocketMap = new Map(); // {userId: socketId}

wss.on("connection", async (socket, req) => {
    try {
        const token = req.headers.cookie?.split("; ").find((row) => row.startsWith("jwt="))
            ?.split("=")[1]; // same extraction logic

        if (!token) throw new Error("No token provided");

        // verify the token
        const decoded = jwt.verify(token, ENV.JWT_SECRET);

        // find the user fromDB
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            throw new Error("User not found");
        }

        // attach user info to socket
        socket.user = user;
        socket.userId = user._id.toString();

        // 2. Add to map INSIDE the block
        userSocketMap.set(socket.userId, socket);
        // console.log("A user connected:", socket.user.fullName);

        // console.log("userSocketMap: ", userSocketMap);

        // 3. Broadcast online status
        broadcastOnlineUsers();

        socket.on("close", () => {
            console.log("Disconnected:", socket.user?.fullName);
            userSocketMap.delete(socket.userId);
            broadcastOnlineUsers();
        });

        // console.log("A user connected", socket.user.fullName);
    } catch (err) {
        console.error("Socket Auth Error:", err.message);
        socket.terminate(); // Immediately kill unauthorized connection
    }

});

function broadcastOnlineUsers() {
    const onlineIds = [...userSocketMap.keys()];
    for (let client of userSocketMap.values()) {
        client.send(JSON.stringify({ type: "getOnlineUsers", payload: onlineIds }));
    }
}

export { wss, app, server };