const mongoose = require("mongoose");

const studentNotificationsSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  formName: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  reply: { type: String, required: true },
});

module.exports = mongoose.model(
  "studentNotifications",
  studentNotificationsSchema
);
