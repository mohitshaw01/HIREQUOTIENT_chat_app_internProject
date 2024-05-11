import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    message : {
        type : "string",
        required : true
    },
},{timestamps : true}); // give us the time the message was created called as cretedAt and updatedAt.

export const Message = mongoose.model("Message", messageSchema);