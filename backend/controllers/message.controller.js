import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import { Message } from "../models/message.model.js"
import {Conversation} from "../models/conversation.model.js"
import { getReceiverSocketId } from "../socket/socket.js"
import { io } from "../socket/socket.js"

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
            conversation = await  Conversation.create({ participants: [senderId, receiverId] });
        }
        const newMessage = new Message({ senderId, receiverId, message });
        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }
        // await conversation.save();
        // await newMessage.save();
        await Promise.all([conversation.save(), newMessage.save()]);
        // socket
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log(error.message)
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
        const messages = conversation.messages;
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(new ApiError(500, "internal server error"));
    }
});