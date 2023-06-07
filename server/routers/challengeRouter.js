import {
    Router
} from "express";
import Challenge from "../database/models/Challenge.js";
import {
    refreshTokenMiddleware
} from "../middleware/refreshToken.js"
import User from "../database/models/User.js";
import {
    body,
    validationResult
  } from 'express-validator';
const router = Router();



router.use(refreshTokenMiddleware);

router.get("/challenges", async (req, res) => {
    try {
        const challenges = await Challenge.find().populate('createdBy', 'firstName lastName');

        const challengesResponse = challenges.map(challenge => {
            const {
                _id,
                name,
                description,
                createdBy,
                tasks
            } = challenge;
            const createdByFullName = createdBy.firstName + ' ' + createdBy.lastName;
            return {
                _id,
                name,
                description,
                createdBy: createdByFullName,
                tasks
            };
        });

        res.status(200).send(challengesResponse);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// am i using this
router.get("/user-challenges", async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId)
            .populate({
                path: "challenges.challenge",
                populate: {
                    path: "createdBy",
                    select: "firstName lastName"
                }
            });

        const userChallenges = user.challenges.map(userChallenge => {
            const {
                challenge
            } = userChallenge;
            const {
                _id,
                name,
                description,
                createdBy,
                tasks
            } = challenge;
            const createdByFullName = createdBy.firstName + ' ' + createdBy.lastName;
            return {
                _id,
                name,
                description,
                createdBy: createdByFullName,
                tasks

            };
        });

        res.status(200).send(userChallenges);
    } catch (error) {
        res.status(500).send(error.message);
    }
});




router.post("/challenges", 

  [
    body("name").notEmpty().withMessage("Name is required and must be a string"),
    body("description").notEmpty().withMessage("Description is required and must be a string"),
  
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const challenge = new Challenge({
          createdBy: req.user._id,
          name: req.body.name,
          description: req.body.description,
          tasks: req.body.tasks
      });

      await challenge.save();

      const populatedChallenge = await Challenge.findById(challenge._id).populate('createdBy');

      let challengeResponse = populatedChallenge.toObject();
      challengeResponse.createdBy = challengeResponse.createdBy.firstName + ' ' + challengeResponse.createdBy.lastName;

      res.status(200).send(challengeResponse);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);








export default router;