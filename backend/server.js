import express from 'express';
import env from 'dotenv';
import connectToDB from './db/dbConnection.js';
// morgan is a HTTP request logger middleware for node.js
import morgan from "morgan";

//
const app = express();
env.config();

app.use(express.json()); // for parsing application/json payloads
app.use(express.urlencoded({ extended: true }));
// morgan is a HTTP request logger middleware for node.js
app.use(morgan("dev")); //HTTP request logger middleware for node.js that logs requests to the console

app.get('/', (req, res) => {
    res.send('Server is ready');
});


// Routes
import authRoutes from './routes/auth.routes.js';
app.use("/api/auth", authRoutes);


// Connect to MongoDB
connectToDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is listening on: ${process.env.PORT}`);
        });
    })
    .catch((error) => console.log("MONGODB connection failed!!!: ", error));
//