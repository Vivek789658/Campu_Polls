const AdminContact = require("../models/contactAdmin");

const showProfessorQuery = async (req, res) => {
  try {
    // Fetch all admin contact requests from the database
    const adminContacts = await AdminContact.find({ status: "pending" });

    // Send the admin contact requests as a response
    res.json(adminContacts);
  } catch (error) {
    console.error("Error fetching admin contact requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { showProfessorQuery };
