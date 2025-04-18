import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../config";

const RegisterStudents = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");
  const [activeTab, setActiveTab] = useState("csv"); // "csv" or "manual"
  const [manualForm, setManualForm] = useState({
    username: "",
    password: "",
    name: "",
    course: "",
    address: "",
    semester: "",
    classSection: ""
  });
  const [manualLoading, setManualLoading] = useState(false);
  const [manualSuccess, setManualSuccess] = useState(false);
  const [manualError, setManualError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setError(null);
      } else {
        setError("Please select a valid CSV file");
        setFile(null);
        setFileName("");
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/registerUser`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccess(true);
      setFile(null);
      setFileName("");
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error.response) {
        setError(error.response.data.message || "Server error occurred");
      } else if (error.request) {
        setError("No response received from server. Please check your connection.");
      } else {
        setError("An error occurred while uploading the file.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setManualForm({
      ...manualForm,
      [name]: value
    });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();

    if (!manualForm.username || !manualForm.password || !manualForm.name ||
      !manualForm.course || !manualForm.semester || !manualForm.classSection) {
      setManualError("Please fill in all required fields");
      return;
    }

    setManualLoading(true);
    setManualError(null);
    setManualSuccess(false);

    try {
      const csvContent = `username,password,name,course,address,type,semester,classSection\n${manualForm.username},${manualForm.password},${manualForm.name},${manualForm.course},${manualForm.address || ""},student,${manualForm.semester},${manualForm.classSection}`;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], 'student.csv', { type: 'text/csv' });
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_BASE_URL}/registerUser`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.success) {
        setManualSuccess(true);
        setManualForm({
          username: "",
          password: "",
          name: "",
          course: "",
          address: "",
          semester: "",
          classSection: ""
        });
      } else {
        setManualError(response.data.message || "Failed to register student");
      }
    } catch (error) {
      console.error("Error registering student:", error);
      setManualError(error.response?.data?.message || "Failed to register student");
    } finally {
      setManualLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileName("");
    setError(null);
    setSuccess(false);
  };

  const resetManualForm = () => {
    setManualForm({
      username: "",
      password: "",
      name: "",
      course: "",
      address: "",
      semester: "",
      classSection: ""
    });
    setManualError(null);
    setManualSuccess(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Register Students
        </h2>
        <p className="text-gray-600">
          Add students to the system for the current semester
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === "csv"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
          onClick={() => setActiveTab("csv")}
        >
          Upload CSV
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === "manual"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
          onClick={() => setActiveTab("manual")}
        >
          Manual Registration
        </button>
      </div>

      {/* CSV Upload Tab */}
      {activeTab === "csv" && (
        <>
          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-500 text-5xl font-bold mb-4">✓</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Registration Successful</h3>
              <p className="text-green-700 mb-4">Students have been successfully registered in the system.</p>
              <button
                onClick={resetForm}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
              >
                Register More Students
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <div className="flex flex-col items-center">
                  <div className="text-gray-400 text-5xl mb-4">📄</div>
                  <div className="mb-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 inline-flex items-center">
                        <span className="mr-2">📤</span>
                        Select CSV File
                      </span>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {fileName ? `Selected file: ${fileName}` : "No file selected"}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    CSV files only
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <span className="text-red-500 mt-1 mr-3 flex-shrink-0">⚠️</span>
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleFileUpload}
                  disabled={!file || loading}
                  className={`${!file || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                    } text-white font-medium py-2 px-8 rounded-md transition duration-300 flex items-center justify-center min-w-[180px]`}
                >
                  {loading ? (
                    <span>Uploading...</span>
                  ) : (
                    <>
                      <span className="mr-2">📤</span>
                      Upload Students
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Manual Registration Tab */}
      {activeTab === "manual" && (
        <>
          {manualSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-500 text-5xl font-bold mb-4">✓</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Student Registered Successfully</h3>
              <p className="text-green-700 mb-4">The student has been added to the system.</p>
              <button
                onClick={resetManualForm}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
              >
                Register Another Student
              </button>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={manualForm.username}
                    onChange={handleManualInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={manualForm.password}
                    onChange={handleManualInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={manualForm.name}
                    onChange={handleManualInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    value={manualForm.course}
                    onChange={handleManualInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="semester"
                    name="semester"
                    value={manualForm.semester}
                    onChange={handleManualInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="classSection" className="block text-sm font-medium text-gray-700 mb-1">
                    Section <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="classSection"
                    name="classSection"
                    value={manualForm.classSection}
                    onChange={handleManualInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={manualForm.address}
                    onChange={handleManualInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {manualError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <span className="text-red-500 mt-1 mr-3 flex-shrink-0">⚠️</span>
                  <p className="text-red-700">{manualError}</p>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={manualLoading}
                  className={`${manualLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                    } text-white font-medium py-2 px-8 rounded-md transition duration-300 flex items-center justify-center min-w-[180px]`}
                >
                  {manualLoading ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <span className="mr-2">👤</span>
                      Register Student
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </>
      )}

      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">CSV File Format</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Your CSV file should include the following columns:</p>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>username - Student's username</li>
            <li>password - Student's password</li>
            <li>name - Student's full name</li>
            <li>course - Student's course</li>
            <li>address - Student's address</li>
            <li>semester - Current semester</li>
            <li>classSection - Student's section</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterStudents;
