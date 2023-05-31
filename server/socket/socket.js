import {
  Server
} from "socket.io";
import User from "../database/models/User.js";
import Challenge from "../database/models/Challenge.js";
import cookie from 'cookie';
import jwt from "jsonwebtoken";


const parseCookies = (cookieString) => {
  return cookie.parse(cookieString || '');
}
let userIdToSocketId = {};

function getSocketIdFromUserId(userId) {
  return userIdToSocketId[userId];
}

const authenticateToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    return user;
  } catch (error) {
    console.log('Error in authenticateToken:', error);
    throw error;
  }
};

const setupSocket = (httpServer) => {
    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    io.use(async (socket, next) => {
      const token = parseCookies(socket.request.headers.cookie).accessToken;
      try {
        const user = await authenticateToken(token);
        console.log("authenticated user", user)
        if (user) {
          socket.user = user;
          next();
        } else {
          next(new Error('Authentication error'));
        }
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });



    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);
      userIdToSocketId[socket.user._id] = socket.id;

      socket.on("join-challenge", async (data) => {
        console.log(`User ${socket.user._id} joined challenge ${data.challengeId}`);

        try {
          const user = await User.findById(socket.user._id);
          if (!user) {
            console.log("User not found");
            return;
          }

          const challenge = await Challenge.findById(data.challengeId).populate('createdBy');
          if (!challenge) {
            console.log(`Challenge with ID ${data.challengeId} not found`);
            return;
          }

          const alreadyJoined = user.challenges.some(c => c.challenge.equals(challenge._id));
          if (alreadyJoined) {
            console.log(`User ${user._id} has already joined challenge ${challenge._id}`);
            return;
          }

          const newChallenge = {
            challenge: challenge._id,
            tasksStatus: challenge.tasks.map((task) => ({
              task: task._id,
              completed: false,
            })),
          };

          user.challenges.push(newChallenge);

          // Save the updated user document
          await user.save();

          socket.emit("challenge-joined-successfully", {
            userId: user._id,
            newChallenge: challenge
          });

          // Now, notify the challenge creator
          const challengeCreatorId = challenge.createdBy._id; // the id of the challenge creator
          const userFirstName = user.firstName; // the user's first name
          const challengeName = challenge.name; // the challenge's name

          // create the message
          const message = `${userFirstName} has joined challenge ${challengeName}`;

          // get the socket id of the challenge creator
          const creatorSocketId = getSocketIdFromUserId(challengeCreatorId);

          // send the message to the creator
          io.to(creatorSocketId).emit("user-joined", {
            message
          });
        } catch (error) {
          console.log('Error in user-joined-challenge:', error);
        }
      });

      socket.on("disconnect", (reason) => {
        console.log("A user disconnected:", socket.id, "Reason:", reason);
        delete userIdToSocketId[socket.user._id];
      });
    });
  };





    export default setupSocket;