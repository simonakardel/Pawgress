import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dog: {
        name: String,
        breed: String,
        dateOfBirth: Date,
        weight: Number
    },
    challenges: [{
        challenge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Challenge'
        },
        tasksStatus: [{
            task: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Task'
            },
            completed: {
                type: Boolean,
                default: false, 
            }
        }]
    }]
});

userSchema.virtual('challenges.isCompleted').get(function() {
    return this.challenges.tasksStatus.every(task => task.completed);
});

const User = mongoose.model("User", userSchema);

export default User;
