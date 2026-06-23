import express from 'express';
import {  getChatPartners, sendMessage } from '../message/message.controller.js';
import { protectRoute } from '../auth/auth.middleware.js';
import { arcjetProtection } from '../../infrastructure/security/arcjet.middleware.js';

const router = express.Router();

// the middleware excute in order - so requests get rate-limited first, then authenticated.
// this is actually more efficient since unauthenticated requests get blocked by rate limiting before hitting the auth middleware
router.use(arcjetProtection,protectRoute);

router.get("/chats", getChatPartners);
// router.get("/:id", getMessagesByConversationId);

router.post("/send", sendMessage);

export default router;