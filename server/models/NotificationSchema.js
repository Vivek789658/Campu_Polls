const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    formName: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    accepted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a compound index for studentId and formName to ensure uniqueness
notificationSchema.index({ studentId: 1, formName: 1 }, { unique: true });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification; 