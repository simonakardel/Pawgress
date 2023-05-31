import mongoose from "mongoose";

const subgoalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    achieved: {
        type: Boolean,
        default: false
    }
});

const goalSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: {
        type: String,
        required: true
    },
    achieved: {
        type: Boolean,
        required: true,
        default: false,
    }, 
    description: {
        type: String,
        required: true,
    },
    subgoals: [subgoalSchema]
});

export default mongoose.model("Goal", goalSchema);

