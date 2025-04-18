const mongoose = require("mongoose");

const adminContactSchema = new mongoose.Schema({
  professorId: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  formName: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending",
  },
});

module.exports = mongoose.model("AdminContact", adminContactSchema);
