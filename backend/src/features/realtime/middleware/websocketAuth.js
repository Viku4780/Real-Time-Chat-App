import { ENV } from "../../../config/env.js";
import User from "../../auth/auth.model.js";
import jwt from 'jsonwebtoken';

export const socketAuth = (handler) => {
    return async (socket, req) => {
        try {
            const token = req.headers.cookie?.split("; ").find((row) => row.startsWith("jwt="))?.split("=")[1];
            if (!token) throw new Error('No token provided');

            const decoded = jwt.verify(token, ENV.JWT_SECRET);
            // console.log('decoded: ', decoded);
            if (!decoded) throw new Error("Unauthorized - Invalid token");

            const user = await User.findById(decoded.userId);
            if (!user) throw new Error("User not found")

            // socket.user = user;
            socket.userId = user._id.toString();

            // console.log('socket.user', socket.userId);

            // run the main logic only if auth passes
            await handler(socket, req);
        } catch (error) {
            console.error("Socket Auth Error:", error.message);
            socket.terminate();
        }
    }
}