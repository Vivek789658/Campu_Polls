const FeedbacksReceived = require("../models/FeedbacksReceived");

const getFeedbackData = async (req, res) => {
  try {
    // Fetch feedback data from the database
    const { feedbackFormName } = req.params;
    const feedbackData = await FeedbacksReceived.find({
      name: feedbackFormName,
    });

    // Send the feedback data as the response
    res.status(200).json(feedbackData);
  } catch (error) {
    console.error("Error fetching feedback data:", error);
    // Send an error response
    res.status(500).json({ error: "Failed to fetch feedback data" });
  }
};

module.exports = { getFeedbackData };
