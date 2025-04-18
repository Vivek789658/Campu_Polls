const mongoose = require("mongoose");

const feedbacksReceived = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  responses: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Students", // Reference to the student who provided the feedback
      },
      answers: [String], // Array of answers submitted by the student
    },
  ],
});

module.exports = mongoose.model("Feedbacks Received", feedbacksReceived);
