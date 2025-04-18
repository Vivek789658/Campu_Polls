const ProfessorQuery = require("../models/contactAdmin");

const handleStatusRequest = async (req, res) => {
  const { requestId, status } = req.params;

  try {
    const updatedRequest = await ProfessorQuery.findByIdAndUpdate(
      requestId,
      { status: status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.status(200).json({ message: `Request ${status} successfully` });
  } catch (error) {
    console.error("Error updating request status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleStatusRequest };
