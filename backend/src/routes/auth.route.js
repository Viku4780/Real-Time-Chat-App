import express from 'express';
import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';

const router = express.Router();

router.use(arcjetProtection);

router.post("/signup", signup);
router.post("/login",arcjetProtection, login);
router.post('/logout', logout);

router.put("/update-profile",protectRoute, updateProfile);

router.get("/check", protectRoute, (req,res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: "Internal server error"});
    }
});

export default router;