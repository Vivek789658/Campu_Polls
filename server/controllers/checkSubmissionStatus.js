const Feedback = require("../models/FeedbacksReceived");

const checkSubmissionStatus = async (req, res) => {
  const { studentId, formId } = req.query;

  if (!studentId || !formId) {
    return res
      .status(400)
      .json({ message: "Student ID and Form ID are required" });
  }

  try {
    const feedback = await Feedback.findOne({
      name: formId,
      "responses.studentId": studentId,
    });

    if (feedback) {
      return res.json({ isSubmitted: true });
    } else {
      return res.json({ isSubmitted: false });
    }
  } catch (error) {
    console.error("Error checking submission status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { checkSubmissionStatus };
