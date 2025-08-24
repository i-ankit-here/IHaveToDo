import { apiError } from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";


export const getAllConversations = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;
    const conversations = await Conversation.find({
        projectId: projectId,
        participants: userId,
    });
    
    if (!conversations) {
        throw apiError(404, "No conversations found");
    }

    res.status(200).json(new apiResponse(200, { conversations }, "Conversations fetched successfully"));
})

export const getMessagesForConversation = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    console.log("conversationId:", conversationId);
    const messages = await Message.find({ conversationId: conversationId });
    console.log("Messages:", messages);
    if (!messages) {
        throw apiError(404, "No messages found");
    }

    res.status(200).json(new apiResponse(200, { messages }, "Messages fetched successfully"));
})
