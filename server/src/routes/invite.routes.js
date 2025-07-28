import express from 'express';
import { createInvite, verifyInvite } from '../controllers/mail.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// This endpoint is protected. Only logged-in users can send invites.
router.post('/', verifyJWT, createInvite);

// This endpoint is public for users to verify their token from the email link.
router.get('/verify/:todoId/:token', verifyJWT, verifyInvite);

export default router;