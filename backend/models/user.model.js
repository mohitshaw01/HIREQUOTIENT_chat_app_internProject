import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username :{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    gender : {
        type: String,
        required: true,
        enum : ["male","female","other"]
    }
},{timestamps: true})

export const User = mongoose.model("User", userSchema);
