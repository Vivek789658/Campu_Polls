const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  options: [String], // For multiple choice questions
});

module.exports = mongoose.model("Question", questionSchema);
