import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import generateToken from "../utils/generateToken.js"
import bcrypt from "bcrypt"

//
export const signupUser = async (req, res) => {
    // steps to signup a user
    // 1. Get the user data from the request body
    // 2. Validate the user data
    // 3. Check if the user already exists
    // 4. Hash the user password
    // 5. Save the user to the database
    // 6. Generate a token for the user
    // 7. Send the token to the user
    try {
        // 1. Get the user data from the request body
        const { fullName,email, password, confirmPassword, gender,username, } = req.body;
        console.log({ fullName,email, password, confirmPassword, gender,username})

        // 2. Validate the user data
        if(!fullName || !email || !password || !confirmPassword || !gender || !username){
            return res.status(400).json({ message: 'Please fill in all fields' });
        };

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // 3. Check if the user already exists
        const existingUser = await User.findOne({ email,username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 4. Hash the user password
        const hashedPassword = await bcrypt.hash(password, 12);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl`;

        // 5. Save the user to the database
        const user = await User.create({
            email,
            password: hashedPassword,
            confirmPassword : hashedPassword,
            fullName,
            gender,
            profilePicture :gender === 'male' ? boyProfilePic : girlProfilePic,
            username
        });
        // 6. Generate a token for the user
        generateToken(user._id,res);
        await user.save();

        // 7. Send the token to the user
        const createdUser = await User.findById(user._id).select(
            "-password -confirmPassword -gender"
        )
        if (!createdUser) throw new ApiError(500, "user registration failed, please try again")

        return res.status(201).json(
                new ApiResponse(200, createdUser, "user registered successfully")
        )
    } catch (error) {
        res.send(new ApiResponse(400, error.message));
    }
}

export const loginUser = asyncHandler(async (req, res) => {
    // steps to login a user
    // 1. Get the user data from the request body
    // 2. Validate the user data
    // 3. Check if the user exists
    // 4. Compare the user password
    // 5. Generate a token for the user

    try {
        // 1. Get the user data from the request body
        const { email, password } = req.body;
        // 2. Validate the user data
        if (!email || !password ) {
            return new ApiError(400, "Please fill in all fields");
        }
        // 3. Check if the user exists
        const user = await User.findOne({ email});
        if (!user) {
            return new ApiError(400, "Invalid credentials");
        }
        // 4. Compare the user password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new ApiError(400, "Invalid credentials");
        }
        // 5. Generate a token for the user
        generateToken(user._id,res);
        // deselect the password and gender fields before sending data
        const newUser = await User.findById(user._id).select(
            "-password -confirmPassword -gender"
        );
        return res.status(200).json(
            new ApiResponse(200, newUser, "user logged in successfully")
        );
    } catch (error) {
        res.send(new ApiResponse(400, error.message));
    }
});

export const logoutUser = asyncHandler(async (req, res) => {
    try {
        // 2. Clear the user token
        // res.clearCookie("token");
        res.cookie('token', '', { maxAge: 0 });
        // 3. Send a response
        return res.status(200).json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        // Error occurred, send error response
        return res.status(500).json({ success: false, message: error.message });
    }
});