import { Router } from "express";
const router = Router();
import { refreshTokenMiddleware } from "../middleware/refreshToken.js"
import Goal from "../database/models/Goal.js";
import {
    body,
    validationResult
  } from 'express-validator';

router.use(refreshTokenMiddleware);


router.get("/achieved-goals", async (req, res) => {

    try {
        const userId = req.user._id;
        
        const goals = await Goal.find({ user: userId, achieved: true });

        res.status(200).send({goals});
    } catch (error){

        res.status(500).send(error.message);
    }

});

router.get("/current-goals", async (req, res) => {
    try {
        const userId = req.user._id;
        
        const goals = await Goal.find({ user: userId, achieved: false });

        res.status(200).send({goals});
    } catch (error){

        res.status(500).send(error.message);
    }

});

router.post("/goals", 

  [
    body('name').isString().escape().withMessage('Name must be a string'),
    body('achieved').optional().isBoolean().withMessage('Achieved must be a boolean'),
    body('description').isString().optional().escape().withMessage('Description must be a string'),
    body('subgoals').isArray().withMessage('Subgoals must be an array'),

  ],
  async (req, res) => {
 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const goal = new Goal({
          user: req.user._id,
          name: req.body.name,
          achieved: req.body.achieved,
          description: req.body.description,
          subgoals: req.body.subgoals
      });

      await goal.save();
      res.status(200).send(goal);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

  

router.patch("/current-goals/:id", async (req, res) => {
    const goalId = req.params.id;
    const updates = req.body;

    try {
        const goal = await Goal.findOneAndUpdate({ _id: goalId }, updates);

        
        if (!goal) {
            return res.status(404).send('Goal not found');
        }

        for (let key in updates) {
            goal[key] = updates[key];
        }

        await goal.save();

        res.send(goal);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete("/goals/:id", async (req, res) => {
    const goalId = req.params.id;

    try {
        const goal = await Goal.findByIdAndRemove({_id: goalId});

        if (!goal) {
            return res.status(404).send("Goal not found");
        }
        res.status(200).send({message: "Goal successfully deleted"});

    } catch (error) {

        res.status(500).send(error.message);
    }
    
});








export default router;