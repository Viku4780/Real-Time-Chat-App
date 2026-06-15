import express from 'express';
// import { Conversation } from './conversation.model';
import { protectRoute } from '../auth/auth.middleware.js';
import { createConversation, getAllConversation } from './conversation.controller.js';

const router = express.Router();

router.post('/create',protectRoute, createConversation);
router.get('/conversation-lists', protectRoute, getAllConversation);

export default router;