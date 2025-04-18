const mongoose = require("mongoose");

const adminsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  type: { type: String, required: true },
});

module.exports = mongoose.model("Admins", adminsSchema);
