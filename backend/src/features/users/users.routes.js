import express from 'express';
import { getAllcontacts } from './users.controller.js';
import { protectRoute } from '../auth/auth.middleware.js';

const router = express.Router();

router.get('/getAllContacts', protectRoute, getAllcontacts);


export default router;