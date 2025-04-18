const AdminContact = require("../models/contactAdmin");

const contactAdmin = async (req, res) => {
  try {
    const { professorId, studentId, formName, question, answer, reason } =
      req.body;

    const newContact = new AdminContact({
      professorId,
      studentId,
      formName,
      question,
      answer,
      reason,
    });

    await newContact.save();

    res.status(200).json({ message: "Admin has been contacted successfully." });
  } catch (error) {
    console.error("Error contacting admin:", error);
    res
      .status(500)
      .json({ error: "Failed to contact admin. Please try again later." });
  }
};

module.exports = { contactAdmin };
