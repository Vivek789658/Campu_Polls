const StudentDb = require("../models/studentsScheema");

const getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find student data by ID and project desired fields
    const studentData = await StudentDb.findById(studentId, {
      username: 1,
      course: 1,
      semester: 1,
      section: 1,
      name: 1,
    });

    if (!studentData) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ studentData });
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ error: "Failed to fetch student details" });
  }
};

module.exports = { getStudentDetails };
