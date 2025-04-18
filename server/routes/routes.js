const express = require("express");
const Router = express.Router();
const { RegisterUsers } = require("../../server/controllers/RegisterStudents");
const multer = require("multer");
const upload = multer({ dest: "TempUploads/" });
const { UserLogin } = require("../../server/controllers/UserLogin");
const { addSubjects } = require("../../server/controllers/addSubjects");
const {
  RegisterProfessors,
} = require("../../server/controllers/RegisterProfessors");
const { assignSubjects } = require("../../server/controllers/assignSubjects");
const { getSubjects } = require("../../server/controllers/getSubjects");
const { getProfessors } = require("../controllers/getProfessors");
const { saveFeedbackForm } = require("../controllers/saveFeedbackForm");
const { getFeedbackFormByName } = require("../controllers/getFeedbackForm");
const { getAllFeedbackForms } = require("../controllers/getAllFeedbackForms");
const { getAllFeedbackResponses } = require("../controllers/getAllFeedbackResponses");
const { submitFeedback } = require("../controllers/submitFeedback");
const { getFeedbackData } = require("../controllers/getfeedbackResponses");
const { RegisterAdmins } = require("../controllers/RegisterAdmins");
const {
  checkSubmissionStatus,
} = require("../controllers/checkSubmissionStatus");
const { saveReplyData } = require("../controllers/professorReply");
const { getReplyData } = require("../controllers/getReply");
const { contactAdmin } = require("../controllers/contactAdmin");
const { showProfessorQuery } = require("../controllers/showProfessorQueries");
const { showProfNotifications } = require("../controllers/profNotification");
const { getStudentDetails } = require("../controllers/getStudentDetails");
const {
  handleStatusRequest,
} = require("../controllers/handleProfessorRequest");
const { createContact } = require("../controllers/contact");
const { getStudentsDetails } = require("../controllers/getStudentsDetails");
const FeedbackForm = require("../models/FeedbackFormScheema");
const Student = require("../models/StudentSchema");
const Notification = require("../models/NotificationSchema");
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

// Debug middleware to log all requests
Router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

Router.post("/registerUser", upload.single("file"), RegisterUsers);
Router.post("/login", UserLogin);
Router.post("/addSubjects", upload.single("file"), addSubjects);
Router.post("/registerProfessors", upload.single("file"), RegisterProfessors);
Router.post("/assignSubjects", upload.single("file"), assignSubjects);
Router.get("/getSubjects/:studentId", getSubjects);
Router.get("/getProfessors/:studentId", getProfessors);
Router.post("/createFeedbackForm", async (req, res) => {
  try {
    console.log("Received feedback form data:", req.body);
    const result = await saveFeedbackForm(req, res);
    console.log("Feedback form creation result:", result);
  } catch (error) {
    console.error("Error in createFeedbackForm route:", error);
    res.status(500).json({
      message: "Internal server error while creating feedback form"
    });
  }
});
Router.get("/getAllFeedbackForms", async (req, res) => {
  try {
    console.log("Processing /getAllFeedbackForms request");
    let feedbackForms = await FeedbackForm.find({})
      .select('name startTime deadline questions subjectCode section')
      .lean();

    console.log(`Found ${feedbackForms.length} feedback forms`);

    // If no forms exist, create a sample form for demonstration
    if (feedbackForms.length === 0) {
      console.log("No feedback forms found. Providing sample form for demonstration");

      const sampleForm = {
        _id: "form1",
        name: "Course Feedback Form CS101",
        startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        subjectCode: "CS101",
        section: "A",
        totalStudents: 45,
        questions: [
          { description: "How would you rate the course content?", type: "rating" },
          { description: "How would you rate the instructor's teaching?", type: "rating" },
          { description: "What aspects of the course did you like the most?", type: "text" },
          { description: "How would you rate the assignments and projects?", type: "rating" },
          { description: "Any additional comments or suggestions?", type: "text" }
        ],
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
      };

      feedbackForms = [sampleForm];
    }

    res.json({
      success: true,
      feedbackForms: feedbackForms,
      message: "Feedback forms fetched successfully"
    });
  } catch (error) {
    console.error("Error in /getAllFeedbackForms:", error);
    res.status(500).json({
      success: false,
      feedbackForms: [],
      message: "An error occurred while fetching feedback forms"
    });
  }
});
Router.get("/getAllFeedbackResponses", async (req, res) => {
  try {
    console.log("Processing /getAllFeedbackResponses request");
    await getAllFeedbackResponses(req, res);
  } catch (error) {
    console.error("Error in /getAllFeedbackResponses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback responses"
    });
  }
});
Router.post("/submitFeedback", submitFeedback);
Router.get("/getfeedbackResponses/:feedbackFormName", async (req, res) => {
  try {
    console.log("Route: /getfeedbackResponses/:feedbackFormName accessed", req.params.feedbackFormName);

    // Check if this is our sample form
    if (req.params.feedbackFormName === "Course Feedback Form CS101") {
      console.log("Providing sample feedback data for demonstration");

      // Sample response data that matches our sample form (same as above)
      const sampleResponses = [
        {
          _id: "sample1",
          formName: "Course Feedback Form CS101",
          formId: "form1",
          studentId: "ST12345",
          studentName: "John Smith",
          email: "john.smith@example.com",
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          answers: ["5", "4", "Excellent course material", "4", "Would recommend this course"]
        },
        {
          _id: "sample2",
          formName: "Course Feedback Form CS101",
          formId: "form1",
          studentId: "ST12346",
          studentName: "Emily Johnson",
          email: "emily.j@example.com",
          submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          answers: ["3", "4", "Good but could be improved", "3", "Decent course overall"]
        },
        {
          _id: "sample3",
          formName: "Course Feedback Form CS101",
          formId: "form1",
          studentId: "ST12347",
          studentName: "Michael Chen",
          email: "michael.c@example.com",
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          answers: ["5", "5", "Very engaging lectures", "5", "Excellent teaching methods"]
        },
        {
          _id: "sample4",
          formName: "Course Feedback Form CS101",
          formId: "form1",
          studentId: "ST12348",
          studentName: "Sarah Williams",
          email: "sarah.w@example.com",
          submittedAt: new Date(),
          answers: ["4", "3", "Good content but fast-paced", "4", "Would take another course"]
        },
        {
          _id: "sample5",
          formName: "Course Feedback Form CS101",
          formId: "form1",
          studentId: "ST12349",
          studentName: "David Lee",
          email: "david.l@example.com",
          submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          answers: ["2", "3", "Material needs updating", "3", "Average experience"]
        }
      ];

      return res.json(sampleResponses);
    }

    // If not the sample form, use the regular controller
    await getFeedbackData(req, res);

  } catch (error) {
    console.error("Route: /getfeedbackResponses/:feedbackFormName error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback responses"
    });
  }
});
Router.post("/registerAdmins", upload.single("file"), RegisterAdmins);
Router.get("/checkSubmissionStatus", checkSubmissionStatus);
Router.post("/submitReply", saveReplyData);
Router.get("/getReply/:_id", getReplyData);
Router.post("/contactAdmin", contactAdmin);
Router.get("/professorQueries", showProfessorQuery);
Router.get("/professorQueries/:_id", showProfNotifications);
Router.get("/getStudentDetails/:studentId", getStudentDetails);
Router.post("/professorQueries/:requestId/:status", handleStatusRequest);
Router.post("/contactUs", createContact);
Router.get("/getFeedbackForm/:feedbackFormName", async (req, res) => {
  try {
    const { feedbackFormName } = req.params;
    console.log("Fetching feedback form:", feedbackFormName);

    const feedbackForm = await FeedbackForm.findOne({ name: feedbackFormName });
    console.log("Found feedback form:", feedbackForm);

    if (!feedbackForm) {
      return res.status(404).json({
        success: false,
        message: "Feedback form not found"
      });
    }

    res.json({
      success: true,
      feedbackForm: {
        name: feedbackForm.name,
        questions: feedbackForm.questions,
        startTime: feedbackForm.startTime,
        deadline: feedbackForm.deadline,
        subjectCode: feedbackForm.subjectCode,
        section: feedbackForm.section
      }
    });
  } catch (error) {
    console.error("Error fetching feedback form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback form"
    });
  }
});

// Add new route for chart data
Router.get("/data", async (req, res) => {
  try {
    // This is sample data - in a real application, you would fetch this from your database
    const chartData = {
      "Excellent": 15,
      "Good": 25,
      "Average": 10,
      "Poor": 5,
      "Very Poor": 2
    };

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chart data"
    });
  }
});

Router.delete("/deleteFeedbackForm/:formName", async (req, res) => {
  try {
    const { formName } = req.params;
    console.log("Deleting feedback form:", formName);

    const result = await FeedbackForm.deleteOne({ name: formName });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Feedback form not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback form deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting feedback form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback form"
    });
  }
});

// Get student notifications
Router.get("/getStudentNotifications/:studentId", async (req, res) => {
  try {
    const notifications = await Notification.find({ studentId: req.params.studentId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
});

// Get student completed feedback forms
Router.get("/getStudentSubmissions/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const FeedbackResponse = require("../models/FeedbackResponseScheema");
    const FeedbackForm = require("../models/FeedbackFormScheema");

    // Find all responses from this student
    const responses = await FeedbackResponse.find({ studentId }).sort({ submittedAt: -1 });

    // Get the form details for each submission
    const submissions = [];

    for (const response of responses) {
      const form = await FeedbackForm.findOne({ name: response.formName });
      if (form) {
        submissions.push({
          _id: response._id,
          formName: response.formName,
          submittedAt: response.submittedAt,
          formData: {
            name: form.name,
            subjectCode: form.subjectCode,
            section: form.section,
            questions: form.questions.length
          }
        });
      }
    }

    res.json({ success: true, submissions });
  } catch (error) {
    console.error("Error fetching student submissions:", error);
    res.status(500).json({ success: false, message: "Failed to fetch student submissions" });
  }
});

// Accept notification
Router.post("/acceptNotification/:notificationId", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.notificationId);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    notification.accepted = true;
    await notification.save();
    res.json({ success: true, message: "Notification accepted" });
  } catch (error) {
    console.error("Error accepting notification:", error);
    res.status(500).json({ success: false, message: "Failed to accept notification" });
  }
});

// Add the new route after other route definitions
Router.post("/getStudentsDetails", getStudentsDetails);

// Update feedback form
Router.put("/updateFeedbackForm/:formName", async (req, res) => {
  try {
    const { formName } = req.params;
    const { questions, startTime, deadline } = req.body;

    console.log("Updating feedback form:", { formName, questions, startTime, deadline });

    // Find the feedback form
    const feedbackForm = await FeedbackForm.findOne({ name: formName });
    if (!feedbackForm) {
      return res.status(404).json({
        success: false,
        message: "Feedback form not found"
      });
    }

    // Update only allowed fields
    feedbackForm.questions = questions;
    feedbackForm.startTime = startTime;
    feedbackForm.deadline = deadline;

    // Save the updated form
    await feedbackForm.save();

    console.log("Feedback form updated successfully");

    res.status(200).json({
      success: true,
      message: "Feedback form updated successfully",
      feedbackForm
    });
  } catch (error) {
    console.error("Error updating feedback form:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update feedback form"
    });
  }
});

// Get form statistics
Router.get("/getFormStatistics", async (req, res) => {
  try {
    const forms = await FeedbackForm.find({});

    const statistics = {
      total: forms.length,
      active: forms.filter(form => {
        const now = new Date();
        return now >= new Date(form.startTime) && now <= new Date(form.deadline);
      }).length,
      pending: forms.filter(form => new Date() < new Date(form.startTime)).length,
      closed: forms.filter(form => new Date() > new Date(form.deadline)).length
    };

    res.json({ success: true, statistics });
  } catch (error) {
    console.error("Error fetching form statistics:", error);
    res.status(500).json({ success: false, message: "Failed to fetch form statistics" });
  }
});

// Get feedback responses for a specific form
Router.get("/getFeedbackResponses/:formName", async (req, res) => {
  try {
    console.log("Route: /getFeedbackResponses/:formName accessed", req.params.formName);

    // Check if this is our sample form
    if (req.params.formName === "Course Feedback Form CS101") {
      console.log("Providing sample feedback data for demonstration");

      // Sample response data that matches our sample form
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

      return res.json(sampleResponses);
    }

    // If not the sample form, use the regular controller
    await getFeedbackData(req, res);

  } catch (error) {
    console.error("Route: /getFeedbackResponses/:formName error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback responses"
    });
  }
});

module.exports = Router;
