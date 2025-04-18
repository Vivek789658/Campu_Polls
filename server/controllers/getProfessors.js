const Professor = require("../models/professorsScheema");
const Student = require("../models/studentsScheema");

const getProfessors = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Fetch student document by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Extract subject IDs and section from the student document
    const subjectIds = student.subjects;
    const studentSection = student.section;

    // Find all professors who teach any of the subjects taken by the student
    const professors = await Professor.find({
      subjects: {
        $elemMatch: {
          subject: { $in: subjectIds },
          section: studentSection,
        },
      },
    });

    // Prepare the response
    const professorsTeachingSubjects = professors.map((professor) => {
      professor.subjects.filter((subject) =>
        subjectIds.includes(subject.subject)
      );
      return { professorName: professor.name };
    });

    res.json({ professorsTeachingSubjects });
  } catch (error) {
    console.error("Error fetching professors:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getProfessors };
