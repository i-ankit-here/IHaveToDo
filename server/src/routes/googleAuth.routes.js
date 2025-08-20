// routes/authRoutes.js
import express from 'express';
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authStart,callBack } from '../controllers/googleAuth.controller.js';

const router = express.Router();

// 1. The route that starts the authorization process
router.get('/', verifyJWT, authStart);

// 2. The callback route that Google redirects to
router.get('/callback', callBack);

export default router;