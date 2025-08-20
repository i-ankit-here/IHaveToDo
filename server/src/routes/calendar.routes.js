import express from "express";
import { getAuthenticatedClient } from "../middlewares/getAuthClient.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getEvents, setEvent, deleteEvent } from "../controllers/calendar.controller.js"

const router = express.Router();

// Example: List upcoming events
router.get('/events', verifyJWT, getAuthenticatedClient, getEvents);

// Example: Create an event (a new "ToDo")
router.post('/events', verifyJWT, getAuthenticatedClient, setEvent);

router.delete('/events', verifyJWT, getAuthenticatedClient, deleteEvent);

export default router;
