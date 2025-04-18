const mongoose = require("mongoose");

const feedbackResponseSchema = new mongoose.Schema({
    formName: {
        type: String,
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    answers: [{
        type: String,
        required: true
    }],
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a compound unique index to prevent multiple submissions
feedbackResponseSchema.index({ formName: 1, studentId: 1 }, { unique: true });

const FeedbackResponse = mongoose.model("FeedbackResponse", feedbackResponseSchema);

module.exports = FeedbackResponse; 