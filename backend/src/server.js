import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './features/auth/auth.routes.js';
import path from 'path';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import messageRoutes from './features/message/message.routes.js'
import { ENV } from './config/env.js';
import cors from 'cors';
import { app, server } from './features/chat/websocket.js';

dotenv.config();

// const app = express();
const __dirname = path.resolve()

const PORT = process.env.PORT || 3000;

app.use(express.json({limit: "5mb"}));
app.use(cookieParser());
app.use(cors({origin: ENV.CLIENT_URL, credentials: true}));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes)

// make ready for deployment
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/*", (_,res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectDB();
})