const FeedbackForm = require("../models/FeedbackFormScheema");

const getFeedbackFormByName = async (req, res) => {
  try {
    const { feedbackFormName } = req.params;

    if (!feedbackFormName) {
      return res.status(400).json({ message: "Feedback form name is required" });
    }

    console.log("Searching for feedback form:", feedbackFormName); // Debug log

    const feedbackForm = await FeedbackForm.findOne({ name: feedbackFormName });

    if (!feedbackForm) {
      console.log("Feedback form not found:", feedbackFormName); // Debug log
      return res.status(404).json({
        message: `Feedback form '${feedbackFormName}' not found. Please make sure the form has been created by the admin.`
      });
    }

    // Check if the form is properly structured
    if (!feedbackForm.questions || !Array.isArray(feedbackForm.questions) || feedbackForm.questions.length === 0) {
      console.log("Invalid feedback form structure:", feedbackForm); // Debug log
      return res.status(400).json({
        message: "The feedback form exists but appears to be invalid. Please contact your administrator."
      });
    }

    console.log("Successfully found feedback form:", feedbackFormName); // Debug log
    res.json({ feedbackForm });
  } catch (error) {
    console.error("Error fetching feedback form:", error);
    res.status(500).json({
      message: "An error occurred while fetching the feedback form. Please try again later."
    });
  }
};

module.exports = { getFeedbackFormByName };
