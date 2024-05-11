import jwt from 'jsonwebtoken'
import {User} from '../models/user.model.js'

const protectRoute = async (req, res, next) => {
    try {
        const jwtToken = req.cookies.token;
        if (!jwtToken) {
            return res.status(401).json({ message: 'Not Authorized' });
        }
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ message: 'Not Authorized' });
        }
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user; // we are adding user to the request object adn we can access it in the next middleware
        next();
    } catch (error) {
       res.status(401).json({ message: 'error' + error.message });
    }
};

export default protectRoute;