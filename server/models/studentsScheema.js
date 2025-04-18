const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },

  password: { type: String, required: true },
  name: { type: String, required: true },
  course: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, required: true },
  semester: { type: Number, required: true },
  section: { type: String, required: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subjects" }],
});

module.exports = mongoose.model("Students", userSchema);
