import { Link } from "react-router-dom";

const SubjectCard = ({ subjectName, subjectCode, professorName, feedbackForm }) => {
  const userDataString = localStorage.getItem("userData");
  const { section } = userDataString ? JSON.parse(userDataString) : {};
  const feedbackFormName = `${subjectCode}_${section}`;

  const getFeedbackStatus = () => {
    if (!feedbackForm) {
      return null;
    }

    const now = new Date();
    const startTime = new Date(feedbackForm.startTime);
    const deadline = new Date(feedbackForm.deadline);

    if (now < startTime) {
      return {
        text: `Form opens on ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}`,
        buttonDisabled: true,
        buttonText: "Not Open Yet",
        buttonClass: "bg-yellow-500 cursor-not-allowed"
      };
    }

    if (now > deadline) {
      return {
        text: "Form deadline has passed",
        buttonDisabled: true,
        buttonText: "Deadline Passed",
        buttonClass: "bg-red-500 cursor-not-allowed"
      };
    }

    return {
      text: `Open until ${deadline.toLocaleDateString()} at ${deadline.toLocaleTimeString()}`,
      buttonDisabled: false,
      buttonText: "Give Feedback",
      buttonClass: "bg-green-500 hover:bg-green-600"
    };
  };

  const status = getFeedbackStatus();

  return (
    <div className="p-6">
      {professorName && professorName !== "Not Assigned" && (
        <div className="mb-4">
          <p className="text-center text-gray-700">
            <span className="font-medium">Professor:</span> {professorName}
          </p>
        </div>
      )}

      {status && (
        <>
          <div className="text-center text-sm text-gray-600 mb-4 p-2 bg-gray-50 rounded">
            {status.text}
          </div>

          <div className="flex justify-center">
            <Link
              to={status.buttonDisabled ? "#" : `/give-feedback/${feedbackFormName}`}
              className={`flex items-center justify-center ${status.buttonClass} text-white py-2.5 px-4 rounded-md w-full max-w-xs transition duration-200 ease-in-out ${!status.buttonDisabled ? "hover:shadow-lg" : ""}`}
              onClick={e => status.buttonDisabled && e.preventDefault()}
            >
              <span>{status.buttonText}</span>
              {!status.buttonDisabled && (
                <svg
                  className="w-4 h-4 ml-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
              )}
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default SubjectCard;
