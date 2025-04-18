import { Link } from "react-router-dom";

const ProfessorCard = ({
  subjectName,
  subjectCode,
  semester,
  course,
  section,
}) => {
  const truncatedSubjectName =
    subjectName.length > 25
      ? subjectName.substring(0, 25) + "..."
      : subjectName;
  const feedbackFormName = `${subjectCode}_${section}`;

  return (
    <div className="p-4 my-3 border-2 border-green-300 w-full max-w-sm mx-auto shadow-md rounded-lg hover:shadow-lg bg-green-100 transition-all duration-200 ease-in-out">
      <h2
        className="mb-2 text-center font-semibold text-lg sm:text-xl md:text-2xl hover:text-ellipsis"
        title={subjectName}
      >
        {truncatedSubjectName}
      </h2>
      <h3 className="mb-2 text-center font-medium text-sm sm:text-md md:text-lg">
        <span className="font-bold">Sub Code:</span> {subjectCode}
      </h3>
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col items-start p-2 text-sm sm:text-base">
          <h4>
            <span className="text-gray-500">Semester:</span> {semester}
          </h4>
          <h4>
            <span className="text-gray-500">Course:</span> {course}
          </h4>
          <h4>
            <span className="text-gray-500">Section:</span> {section}
          </h4>
        </div>
        <Link
          to={`/see-feedback/${feedbackFormName}`}
          className="flex items-center text-white border-2 border-green-700 py-2 px-4 bg-green-500 rounded-md hover:bg-green-600 hover:shadow-xl text-sm sm:text-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 transition-all duration-200 ease-in-out"
        >
          <span>See Feedback</span>
        </Link>
      </div>
    </div>
  );
};

export default ProfessorCard;



