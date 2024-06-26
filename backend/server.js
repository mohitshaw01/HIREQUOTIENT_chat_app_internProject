import express from 'express';
import env from 'dotenv';
import cors from 'cors';
import connectToDB from './db/dbConnection.js';
import morgan from "morgan";
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { app, server } from './socket/socket.js';

env.config();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("Server is active");
});

// Routes
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", userRoutes);

// Handling __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static assets if in production
app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(process.env.PORT, () => {
    connectToDB()
        .then(() => {
            console.log(`Server is listening on: ${process.env.PORT}`);
        })
        .catch((error) => console.log("MONGODB connection failed!!!: ", error));
});
