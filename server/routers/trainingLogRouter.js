import { Router } from "express";
const router = Router();
import { refreshTokenMiddleware } from "../middleware/refreshToken.js"
import TrainingLog from "../database/models/TrainingLog.js";

import {
  body,
  validationResult
} from 'express-validator';

router.use(refreshTokenMiddleware);


router.get("/training-logs", async (req, res) => {
  try {
      const userId = req.user._id;
      const trainingLogs = await TrainingLog.find({ user: userId }).populate('goals.goal');
  
      res.status(200).send(trainingLogs);
  } catch (error){
      res.status(500).send(error.message);
  }
});


router.post("/training-logs", 

  [
    body('goals').isArray().withMessage('Goals must be an array'),
    body('goals.*.rating').isInt({min: 0, max: 5}).withMessage('Rating must be an integer between 0 and 5'),
    body('goals.*.name').isString().withMessage('Name must be a string'),
    body('notes').isString().optional().escape(),
    body('date').isISO8601().withMessage('Date must be in ISO 8601 format'),
    body('behaviours').isArray().optional().withMessage('Behaviours must be an array'),
    body('behaviours.*.name').optional().isString().escape(),
    body('behaviours.*.rating').optional().isInt({min: 0, max: 5}).withMessage('Rating must be an integer between 0 and 5'),
  ],
  async (req, res) => {
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const trainedGoals = req.body.goals;
      const trainedBehaviours = req.body.behaviours;

      const newTrainingLog = new TrainingLog({
        user: req.user._id,
        goals: trainedGoals.map(goal => ({ rating: goal.rating, name: goal.name })),
        notes: req.body.notes,
        date: req.body.date,
        behaviours: trainedBehaviours.map(behaviour => ({ name: behaviour.name, rating: behaviour.rating }))
      });

      await newTrainingLog.save();
      res.status(200).send(newTrainingLog);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

  export default router;
  