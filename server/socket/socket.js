import {
  Server
} from "socket.io";
import User from "../database/models/User.js";
import Challenge from "../database/models/Challenge.js";
import cookie from 'cookie';
import jwt from "jsonwebtoken";
import { updateUserTasksStatus } from "../utils/updateUserTasksStatus.js";


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
          socket.emit("error", {
            message: "User not found"
          });
          return;
        }

        const challenge = await Challenge.findById(data.challengeId).populate('createdBy');
        if (!challenge) {
          socket.emit("error", {
            message: "Challenge not found"
          });
          return;
        }

        const alreadyJoined = user.challenges.some(c => c.challenge.equals(challenge._id));
        if (alreadyJoined) {
          socket.emit("error", {
            message: `User ${user._id} has already joined challenge ${challenge.name}`
          });
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

        await user.save();
        const updatedUserDocument = await User.findById(user._id).populate({
          path: 'challenges.challenge',
          populate: {
            path: 'createdBy',
            select: 'firstName lastName -_id'
          }
        });

        const updatedUser = await updateUserTasksStatus(updatedUserDocument);

        socket.emit("challenge-joined-successfully", {
          user: updatedUser,
          newChallenge: challenge
        });

        const challengeCreatorId = challenge.createdBy._id;
        const userFirstName = user.firstName;
        const challengeName = challenge.name;

        const message = `${userFirstName} has joined challenge ${challengeName}`;

        const creatorSocketId = getSocketIdFromUserId(challengeCreatorId);

        io.to(creatorSocketId).emit("user-joined-challenge", {
          message
        });

      } catch (error) {
        socket.emit("error", {
          message: "An error occured while joining challenge."
        })
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("A user disconnected:", socket.id, "Reason:", reason);
      delete userIdToSocketId[socket.user._id];
    });
  });
};


export default setupSocket;