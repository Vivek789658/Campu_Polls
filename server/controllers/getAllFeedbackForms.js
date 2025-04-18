const FeedbackForm = require("../models/FeedbackFormScheema");

const getAllFeedbackForms = async (req, res) => {
    try {
        console.log("Fetching all feedback forms"); // Debug log

        const feedbackForms = await FeedbackForm.find({})
            .select('name startTime deadline questions subjectCode section') // Include subjectCode and section
            .lean(); // Convert to plain JavaScript objects

        console.log(`Found ${feedbackForms.length} feedback forms:`, JSON.stringify(feedbackForms, null, 2)); // Enhanced debug log

        if (!feedbackForms || feedbackForms.length === 0) {
            console.log("No feedback forms found, returning empty array");
            return res.json({
                feedbackForms: [],
                message: "No feedback forms found"
            });
        }

        console.log("Returning feedback forms:", JSON.stringify(feedbackForms, null, 2));
        res.json({
            feedbackForms: feedbackForms,
            message: "Feedback forms fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching feedback forms:", error);
        res.status(500).json({
            feedbackForms: [],
            message: "An error occurred while fetching feedback forms"
        });
    }
};

module.exports = { getAllFeedbackForms }; 