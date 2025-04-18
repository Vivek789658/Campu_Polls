const ReplySchema = require("../models/studNotifications");
const getReplyData = async (req, res) => {
  try {
    const { _id } = req.params;

    const notifications = await ReplySchema.find({ studentId: _id });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

module.exports = { getReplyData };
