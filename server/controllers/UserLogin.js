const StudentModel = require("../models/studentsScheema");
const ProfessorModel = require("../models/professorsScheema");
const AdminModel = require("../models/AdminScheema");



const UserLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user =
      (await AdminModel.findOne({ username })) ||
      (await ProfessorModel.findOne({ username })) ||
      (await StudentModel.findOne({ username }));
    // const user = "adarsh";
    // const password = "1234";
    //const Type = user.type;

    if (user && password === user.password) {
      res.status(200).json({ message: "Login successful!", data: user });
    } else {
      // console.log("reached");
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }

};

module.exports = { UserLogin };
