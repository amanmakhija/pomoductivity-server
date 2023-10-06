const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        taskName: {
            type: String,
            required: true,
        },
        taskDetails: {
            type: String,
            required: true,
        },
        estimatedTime: {
            type: Number,
            required: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);