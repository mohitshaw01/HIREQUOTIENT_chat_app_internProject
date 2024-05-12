import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import { User } from "../models/user.model.js"


export const getUsersForSidebar = asyncHandler(async (req, res, next) => {
    // steps: to get he users for the sidebar
    // 1. get the user from the request object
    // 2. get the users from the database
    // 3. send the users to the client
    try {
        const loggedInUser = req.user._id;
        // Include the logged-in user in the list
        // const users = await User.find({ $or: [{ _id: loggedInUser }, { _id: { $ne: loggedInUser } }] });
        const filterUser = await User.find({ _id: { $ne: loggedInUser } }).select("-password -confirmPassword");
        // console.log(users);
        if (!filterUser) {
            return res.send("No users found");
        }
        res.status(200).json(filterUser);
    } catch (error) {
        return next(ApiError.internal("Error fetching users" + error.message));
    }
});
