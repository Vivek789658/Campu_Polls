import React from "react";
import { useNavigate } from "react-router-dom";
import zoro from "./404.png";

const ErrorPage = () => {
  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : {};
  const type = userData?.type || ""; // Provide default empty string if type is undefined

  return (
    <div className="error-container flex items-center justify-center h-screen bg-gradient-to-t from-gray-200 to-white">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-6">
          Uh oh! We couldn't find that page.
        </h1>
        <p className="text-gray-600 mb-6">
          The page you were looking for might not exist, or you may have typed
          the URL incorrectly.
        </p>
        <img src={zoro} alt="Error page illustration" />
        <a
          href={type === "admin" ? "/admin" : type === "professor" ? "/professor" : "/"}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
