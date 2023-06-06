import {
    Router
} from "express";
const router = Router();
import {
    refreshTokenMiddleware
} from "../middleware/refreshToken.js"

import User from "../database/models/User.js";
import { updateUserTasksStatus } from "../utils/updateUserTasksStatus.js";

import {
    body,
    validationResult
} from 'express-validator';

router.use(refreshTokenMiddleware);

router.get("/user", async (req, res) => {
    try {
        const userDocument = await User.findById(req.user._id).populate({
            path: 'challenges.challenge',
            populate: {
                path: 'createdBy',
                select: 'firstName lastName -_id'
            }
        });

        if (!userDocument) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = await updateUserTasksStatus(userDocument);

        res.json({
            user: user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message
        });
    }
});





router.patch('/user',
    [
        body('firstName').optional().trim().escape(),
        body('lastName').optional().trim().escape(),
        body('dog').optional().isObject(),
        body('dog.name').optional().escape(),
        body('dog.breed').optional().escape(),
        body('dog.weight').optional().isNumeric(),
        body('dog.dateOfBirth').optional().isISO8601().toDate()
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {

            return res.status(400).json({
                errors: errors.array()
            });
        }

        console.log(req.body)
        const updates = req.body;
        delete updates.email;

        try {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }
  

            for (let key in updates) {
                if (key !== 'dog') {
                    user[key] = updates[key];
                } else if (key === 'dog') {
                    if (!user['dog']) user['dog'] = {};

                    for (let dogKey in updates['dog']) {
                        user['dog'][dogKey] = updates['dog'][dogKey];
                    }
                }
            }

            await user.save();
            res.send(user);
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message: error.message
            });
        }
    });



router.patch('/user-challenge',
    [
        body('_id').not().isEmpty(),
        body('tasksStatus.*.taskId').not().isEmpty(),
        body('tasksStatus.*.completed').optional().isBoolean(),
    ],
    async (req, res) => {


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }


        const {
            _id,
            tasksStatus
        } = req.body;

        try {
            const user = await User.findById(req.user._id);

            if (!user) {

                return res.status(404).json({
                    message: "User not found"
                });
            }

            const challenge = user.challenges.find(challenge => challenge.challenge.toString() === _id.toString());


            if (!challenge) {
                return res.status(404).json({
                    message: "Challenge not found"
                });
            }

            tasksStatus.forEach(task => {

                const taskStatus = challenge.tasksStatus.find(status => status.task.toString() === task.taskId);
                if (taskStatus) {

                    taskStatus.completed = task.completed;
                } else {
                    return res.status(404).json({
                        message: "Task status not found"
                    });
                }
            });

            try {

                await user.save();

            } catch (error) {

            }

            try {
                const userDocument = await User.findById(req.user._id).populate({
                    path: 'challenges.challenge',
                    populate: {
                        path: 'createdBy',
                        select: 'firstName lastName -_id'
                    }
                });
                const user = updateUserTasksStatus(userDocument);

                res.send(user);

            } catch (error) {
                console.log("couldnt update user")
            }




        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    });







export default router;