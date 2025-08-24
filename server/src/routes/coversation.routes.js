import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import { getAllConversations, getMessagesForConversation } from "../controllers/conversation.controller.js";

const router = Router();

router.route("/messages/:conversationId").get(verifyJWT,getMessagesForConversation);
router.route("/:projectId/:userId").get(verifyJWT,getAllConversations);

export default router;  
