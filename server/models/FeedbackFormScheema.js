const mongoose = require("mongoose");

const feedbackFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  questions: [{
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["text", "yesNo", "rating", "multiple"],
      required: true
    },
    options: {
      type: [String],
      default: []
    }
  }],
  startTime: {
    type: Date,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  subjectCode: {
    type: String,
    trim: true
  },
  section: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for subjectCode and section
feedbackFormSchema.index({ subjectCode: 1, section: 1 }, { unique: true, sparse: true });

const FeedbackForm = mongoose.model("FeedbackForm", feedbackFormSchema);

module.exports = FeedbackForm;
