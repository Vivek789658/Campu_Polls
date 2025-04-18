const Student = require("../models/StudentSchema");

const getStudentsDetails = async (req, res) => {
    try {
        const { studentIds } = req.body;

        if (!studentIds || !Array.isArray(studentIds)) {
            return res.status(400).json({
                success: false,
                message: "Student IDs array is required"
            });
        }

        const students = await Student.find(
            { _id: { $in: studentIds } },
            'name email course section' // Only select needed fields
        );

        res.json({
            success: true,
            students
        });
    } catch (error) {
        console.error("Error fetching student details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch student details"
        });
    }
};

module.exports = { getStudentsDetails }; 