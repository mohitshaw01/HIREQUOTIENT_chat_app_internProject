import jwt from 'jsonwebtoken';

const generateToken = (userId,res) => {
    const token =  jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    });
    res.cookie('token', token, {
        httpOnly: true, // prevent cookie from being accessed on the client side and xss attacks
        maxAge: 15 * 24 * 60 * 60 * 1000, // Milliseconds
        sameSite : "strict",
        secure : process.env.NODE_ENV === 'production' ? true : false
    });
};


export default generateToken;
