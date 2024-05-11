import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import { Message } from "../models/message.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import {Conversation} from "../models/conversation.model.js"


export const sendMessage = asyncHandler(async (req, res) => {
    // steps to send a message
    // 1. check if the conversation exists
    // 2. check if the user is a participant in the conversation
    // 3. create the message
    // 4. add the message to the conversation
    // 5. return the message
    try {
        const { id : receiverId } = req.params;
        const { message } = req.body;
        const senderId = req.user._id;
        // check if the conversation exists between the sender and the receiver 
        let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });
        if(!conversation) {
            // then create one
            conversation = new Conversation({ participants: [senderId, receiverId] });
        }
        
        const newMessage = new Message({ senderId, receiverId, message });
        if(newMessage) {
            conversation.messages.push(newMessage);
        }
        // ADD socketes here

        // await conversation.save();
        // await newMessage.save();
        await Promise.all([conversation.save(), newMessage.save()]);


        res.status(201).json(new ApiResponse(201, {newMessage,Conversation}));
    } catch (error) {
        res.status(500).json(new ApiError(500, "internal server errorr "+error.message));
    }
});

export const getMessages = asyncHandler(async (req, res) => {
    // steps to get messages
    // 1. check if the conversation exists
    // 2. check if the user is a participant in the conversation
    // 3. return the messages in the conversation
    try {
        const { id : userToChat } = req.params;
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({ participants: { $all: [senderId, userToChat] } }).populate("messages");
        if(!conversation) {
            return res.status(404).json(new ApiError(404, "No conversation found"));
        }
        res.status(200).json(new ApiResponse(200, conversation.messages));
    } catch (error) {
        res.status(500).json(new ApiError(500, "internal server error"));
    }
});