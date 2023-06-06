import express from "express";
import dotenv from "dotenv"
import connect from "./database/connection.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

import cors from "cors";
app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173"]
}));

import setupSocket from "./socket/socket.js";


//MIDDLEWARE
app.use(express.json());
app.use(cookieParser());


// CONNECTION TO DATABASE
connect()
  .then(() => {
    console.log('Database connection established');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

// ROUTERS
import authRouter from "./routers/authRouter.js";
app.use(authRouter);
import userRouter from "./routers/userRouter.js";
app.use(userRouter);
import goalRouter from "./routers/goalRouter.js"
app.use(goalRouter);
import contactRouter from "./routers/contactRouter.js";
app.use(contactRouter);
import trainingLogRouter from "./routers/trainingLogRouter.js";
app.use(trainingLogRouter);
import challengeRouter from "./routers/challengeRouter.js";
app.use(challengeRouter);


const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log("Server is running on port", server.address().port));
setupSocket(server);