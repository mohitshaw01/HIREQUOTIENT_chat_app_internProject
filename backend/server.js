import express from 'express';
import env from 'dotenv';
import connectToDB from './db/dbConnection.js';
// morgan is a HTTP request logger middleware for node.js
import morgan from "morgan";
import cookieParser from 'cookie-parser';

//
const app = express();
env.config();

app.use(cookieParser()); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(express.json()); // for parsing application/json payloads
app.use(express.urlencoded({ extended: true }));
// morgan is a HTTP request logger middleware for node.js
app.use(morgan("dev")); //HTTP request logger middleware for node.js that logs requests to the console

app.get('/', (req, res) => {
    res.send('Server is ready');
});


// Routes
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);


// Connect to MongoDB
connectToDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is listening on: ${process.env.PORT}`);
        });
    })
    .catch((error) => console.log("MONGODB connection failed!!!: ", error));
//