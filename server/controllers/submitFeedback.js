const FeedbackForm = require("../models/FeedbackFormScheema");
const FeedbackResponse = require("../models/FeedbackResponseScheema");
const debug = require("debug")("app:submitFeedback");

const submitFeedback = async (req, res) => {
  try {
    const { formName, studentId, answers } = req.body;

    debug("Submitting feedback:", { formName, studentId, answersCount: answers.length });

    // Validate required fields
    if (!formName || !studentId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields or invalid data format"
      });
    }

    // Check if form exists
    const form = await FeedbackForm.findOne({ name: formName });
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Feedback form not found"
      });
    }

    // Validate number of answers matches number of questions
    if (answers.length !== form.questions.length) {
      return res.status(400).json({
        success: false,
        message: "Number of answers does not match number of questions"
      });
    }

    // Check if student has already submitted feedback
    const existingResponse = await FeedbackResponse.findOne({
      formName,
      studentId
    });

    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted feedback for this form"
      });
    }

    // Create new feedback response
    const feedbackResponse = new FeedbackResponse({
      formName,
      studentId,
      answers,
      submittedAt: new Date()
    });

    await feedbackResponse.save();
    debug("Feedback submitted successfully");

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully"
    });
  } catch (error) {
    debug("Error submitting feedback:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback"
    });
  }
};

module.exports = { submitFeedback };
