const AdminContact = require("../models/contactAdmin");

const showProfNotifications = async (req, res) => {
  try {
    const professorId = req.params;
    // Fetch all admin contact requests from the database
    const adminContacts = await AdminContact.find({ professorId: professorId });

    // Send the admin contact requests as a response
    res.json(adminContacts);
  } catch (error) {
    console.error("Error fetching admin contact requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { showProfNotifications };
