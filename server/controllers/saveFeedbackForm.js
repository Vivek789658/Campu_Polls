const FeedbackForm = require("../models/FeedbackFormScheema");
const Student = require("../models/StudentSchema");
const Notification = require("../models/NotificationSchema");

const saveFeedbackForm = async (req, res) => {
  try {
    const { name, questions, deadline, startTime, subjectCode, section } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Form name is required" });
    }

    // Validate form name format (SUBJECTCODE_SECTION)
    const nameParts = name.trim().split('_');
    if (nameParts.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Form name must follow the format: SUBJECTCODE_SECTION (e.g., CS101_A)"
      });
    }

    const [extractedSubjectCode, extractedSection] = nameParts;

    // Validate subject code and section format
    const subjectCodeRegex = /^[A-Z0-9]+$/;
    const sectionRegex = /^[A-Z0-9]+$/;

    if (!subjectCodeRegex.test(extractedSubjectCode) || !sectionRegex.test(extractedSection)) {
      return res.status(400).json({
        success: false,
        message: "Subject code and section must contain only uppercase letters and numbers"
      });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: "At least one question is required" });
    }

    if (!deadline) {
      return res.status(400).json({ success: false, message: "Deadline is required" });
    }

    if (!startTime) {
      return res.status(400).json({ success: false, message: "Start time is required" });
    }

    // Validate dates
    const startDate = new Date(startTime);
    const deadlineDate = new Date(deadline);
    const now = new Date();

    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid start time format" });
    }

    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid deadline format" });
    }

    if (startDate >= deadlineDate) {
      return res.status(400).json({ success: false, message: "Start time must be before deadline" });
    }

    // Check if form with same name already exists
    const existingForm = await FeedbackForm.findOne({ name: name.trim() });
    if (existingForm) {
      return res.status(400).json({ success: false, message: "A feedback form with this name already exists" });
    }

    // Validate questions
    const validatedQuestions = questions.map(question => {
      const { description, type, options } = question;

      if (!description || !description.trim()) {
        throw new Error("Question description is required");
      }

      if (!type || !["text", "yesNo", "rating", "multiple"].includes(type)) {
        throw new Error(`Invalid question type: ${type}`);
      }

      // Validate options for multiple choice questions
      if (type === "multiple") {
        if (!Array.isArray(options) || options.filter(opt => opt.trim()).length < 2) {
          throw new Error("Multiple choice questions require at least 2 options");
        }
        return {
          description: description.trim(),
          type,
          options: options.filter(opt => opt.trim())
        };
      }

      // For other types, return without options
      return {
        description: description.trim(),
        type,
        options: []
      };
    });

    // Create and save the feedback form
    const feedbackForm = new FeedbackForm({
      name: name.trim(),
      questions: validatedQuestions,
      deadline: deadlineDate,
      startTime: startDate,
      subjectCode: extractedSubjectCode,
      section: extractedSection
    });

    const savedFeedbackForm = await feedbackForm.save();

    // Find all students who should receive the notification
    const students = await Student.find({});

    // Create notifications for each student
    const notificationPromises = students.map(student => {
      const notification = new Notification({
        studentId: student._id,
        formName: name.trim(),
        deadline: deadlineDate
      });
      return notification.save();
    });

    await Promise.all(notificationPromises);

    res.status(201).json({
      success: true,
      message: "Feedback form created successfully",
      feedbackForm: savedFeedbackForm
    });
  } catch (error) {
    console.error("Error creating feedback form:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create feedback form"
    });
  }
};

module.exports = { saveFeedbackForm };
