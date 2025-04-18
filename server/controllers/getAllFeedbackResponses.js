const FeedbackResponse = require("../models/FeedbackResponseScheema");

const getAllFeedbackResponses = async (req, res) => {
    try {
        console.log("Fetching all feedback responses");

        let feedbackResponses = await FeedbackResponse.find({}).lean();
        console.log(`Found ${feedbackResponses.length} feedback responses in database`);

        // If no real responses exist, generate sample data for demonstration
        if (feedbackResponses.length === 0) {
            console.log("No real responses found. Generating sample data for demonstration.");

            // Generate sample data
            const sampleResponses = [
                {
                    _id: "sample1",
                    formName: "Course Feedback Form CS101",
                    formId: "form1",
                    studentId: "ST12345",
                    studentName: "John Smith",
                    email: "john.smith@example.com",
                    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                    answers: ["5", "4", "Excellent course material", "4", "Would recommend this course"]
                },
                {
                    _id: "sample2",
                    formName: "Course Feedback Form CS101",
                    formId: "form1",
                    studentId: "ST12346",
                    studentName: "Emily Johnson",
                    email: "emily.j@example.com",
                    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                    answers: ["3", "4", "Good but could be improved", "3", "Decent course overall"]
                },
                {
                    _id: "sample3",
                    formName: "Course Feedback Form CS101",
                    formId: "form1",
                    studentId: "ST12347",
                    studentName: "Michael Chen",
                    email: "michael.c@example.com",
                    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                    answers: ["5", "5", "Very engaging lectures", "5", "Excellent teaching methods"]
                },
                {
                    _id: "sample4",
                    formName: "Course Feedback Form CS101",
                    formId: "form1",
                    studentId: "ST12348",
                    studentName: "Sarah Williams",
                    email: "sarah.w@example.com",
                    submittedAt: new Date(), // Today
                    answers: ["4", "3", "Good content but fast-paced", "4", "Would take another course"]
                },
                {
                    _id: "sample5",
                    formName: "Course Feedback Form CS101",
                    formId: "form1",
                    studentId: "ST12349",
                    studentName: "David Lee",
                    email: "david.l@example.com",
                    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                    answers: ["2", "3", "Material needs updating", "3", "Average experience"]
                }
            ];

            feedbackResponses = sampleResponses;
        }

        console.log(`Returning ${feedbackResponses.length} feedback responses`);
        res.json(feedbackResponses);
    } catch (error) {
        console.error("Error fetching all feedback responses:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching feedback responses"
        });
    }
};

module.exports = { getAllFeedbackResponses }; 