import mongoose from "mongoose";


const trainingLogSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    goals: [{
        goal: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Goal'
        },
        name: {
            type: String
        },
        rating: Number
      }],
    behaviours: [{
        name: String,
        rating: Number
    }],
    date: {
        type: Date,
        required: true,
    },
    notes: {
        type: String
    }

  
});

export default mongoose.model("TrainingLog", trainingLogSchema);