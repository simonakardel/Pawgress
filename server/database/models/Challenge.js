import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    dayNumber: Number,
    name: String,
  
});

const challengeSchema = new mongoose.Schema({
    name: String,
    description: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    tasks: [taskSchema],
    users: [{  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

});

const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;