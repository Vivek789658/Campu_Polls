const mongoose = require("mongoose");

const subjectsSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true, unique: true },
  subjectName: { type: String, required: true },
  semester: { type: Number, required: true },
  course: { type: String, required: true },
});

module.exports = mongoose.model("Subjects", subjectsSchema);
