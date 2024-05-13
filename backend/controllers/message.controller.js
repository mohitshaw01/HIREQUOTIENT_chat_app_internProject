import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import { Message } from "../models/message.model.js"
import {Conversation} from "../models/conversation.model.js"
import { getReceiverSocketId } from "../socket/socket.js"
import { io } from "../socket/socket.js"
import dotenv from "dotenv";
dotenv.config();

// export const sendMessage = asyncHandler(async (req, res) => {
//     // steps to send a message
//     // 1. check if the conversation exists
//     // 2. check if the user is a participant in the conversation
//     // 3. create the message
//     // 4. add the message to the conversation
//     // 5. return the message
//     try {
//         const { id : receiverId } = req.params;
//         const { message } = req.body;
//         const senderId = req.user._id;
//         // check if the conversation exists between the sender and the receiver 
//         let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });
//         if(!conversation) {
//             // then create one
//             conversation = await  Conversation.create({ participants: [senderId, receiverId] });
//         }
//         const newMessage = new Message({ senderId, receiverId, message });
//         if(newMessage) {
//             conversation.messages.push(newMessage._id);
//         }
//         // await conversation.save();
//         // await newMessage.save();
//         await Promise.all([conversation.save(), newMessage.save()]);
//         // socket
//         const receiverSocketId = getReceiverSocketId(receiverId);
//         if(receiverSocketId) {
//             io.to(receiverSocketId).emit("newMessage", newMessage);
//         }

//         res.status(201).json(newMessage);
//     } catch (error) {
//         console.log(error.message)
//         res.status(500).json(new ApiError(500, "internal server errorr "+error.message));
//     }
// });

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

// LLM INTEGRATIOn on backend
import { GoogleGenerativeAI } from "@google/generative-ai";
let genAI;
try {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
} catch (error) {
    console.log(error.message);
}

export async function getGeminiResponse(message, username) {
    if(!genAI) {
        return "I am not available at the moment";
    }
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Give response to the person seding the message that you can try contactiong me later.`
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}


export const botMessage = async (req, res) => {
    const { message, receiverId } = req.body;
    const senderId = req.user._id;
    if (!message || !receiverId || !senderId) {
        return res.status(400).json({
            message: "message, receiverId, and senderId are required",
        });
    }
    const response = await getGeminiResponse(message, senderId);
    const newmessage = new Message({
        senderId,
        receiverId,
        message: response,
    });
    await newmessage.save();
    // // socket
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newmessage);
    }
    res.status(200).json({ response });
}

export const sendMessage = asyncHandler(async (req, res) => {
    // steps to send a message
    // 1. check if the conversation exists
    // 2. check if the user is a participant in the conversation
    // 3. create the message
    // 4. add the message to the conversation
    // 5. return the message
    try {
        const { id : receiverId } = req.params;
        const { message,status } = req.body;
        const senderId = req.user._id;
        // check if the conversation exists between the sender and the receiver 
        let conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } });
        if(status === "busy"){
            const response = await getGeminiResponse(message, senderId);
            return res.status(200).json({response});
        }
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
