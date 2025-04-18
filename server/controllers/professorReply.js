const ReplySchema = require("../models/studNotifications");
const saveReplyData = async (req, res) => {
  try {
    const { studentId, formName, question, answer, reply } = req.body;

    const replyData = new ReplySchema({
      studentId,
      formName,
      question,
      answer,
      reply,
    });

    await replyData.save();

    res.status(201).json({ message: "Reply data saved successfully" });
  } catch (error) {
    console.error("Error saving reply data:", error);
    res.status(500).json({ error: "Failed to save reply data" });
  }
};

module.exports = { saveReplyData };
