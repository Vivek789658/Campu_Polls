const Contact = require("../models/contactScheema");
createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: "Contact saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = { createContact };
