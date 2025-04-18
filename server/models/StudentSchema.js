const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    course: {
        type: String,
        required: true,
        trim: true
    },
    semester: {
        type: String,
        required: true,
        trim: true
    },
    section: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        default: "student",
        enum: ["student"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student; 