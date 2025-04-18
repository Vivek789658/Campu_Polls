const Student = require("../models/studentsScheema");
const subjectsModel = require("../models/subjectsScheema");
const Professor = require("../models/professorsScheema");

const getSubjects = async (req, res) => {
  try {
    const Id = req.params.studentId;

    // Fetch student document by ID
    let user = await Student.findById(Id);
    let type = "stud";
    if (!user) {
      user = await Professor.findById(Id);
      type = "prof";
    }

    if (!user) {
      return res.status(404).json({ error: "Student/Professor not found" });
    }

    if (type === "stud") {
      // Extract subject IDs from the student document
      const subjectIds = user.subjects;

      // Fetch subjects using the extracted subject IDs
      const subjects = await subjectsModel.find(
        { _id: { $in: subjectIds } },
        "subjectName subjectCode semester course"
      );

      res.json({ subjects });
    } else if (type === "prof") {
      // If user is a professor, fetch subjects from the professor document
      const subjects = await Promise.all(
        user.subjects.map(async (subject) => {
          const subjectDoc = await subjectsModel.findById(subject.subject);
          return {
            subjectName: subjectDoc.subjectName,
            subjectCode: subjectDoc.subjectCode,
            semester: subjectDoc.semester,
            course: subjectDoc.course,
            section: subject.section,
            id: Math.floor(Math.random() * 1000) + 1,
          };
        })
      );

      res.json({ subjects });
    }
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getSubjects };
