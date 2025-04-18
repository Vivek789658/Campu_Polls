import React, { useState } from "react";
import axios from "axios";
require("dotenv").config();
const BASE_URL = "http://192.168.92.153:4000";

const AddSubjects = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("");

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
        `${BASE_URL}/api/v1/addSubjects`,
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

  const resetForm = () => {
    setFile(null);
    setFileName("");
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Add Subjects to the System
        </h2>
        <p className="text-gray-600">
          Upload a CSV file containing subject information
        </p>
      </div>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-500 text-5xl font-bold mb-4">✓</div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Subjects Added Successfully</h3>
          <p className="text-green-700 mb-4">The subjects have been added to the system.</p>
          <button
            onClick={resetForm}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-300"
          >
            Add More Subjects
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
                  Upload Subjects
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">CSV File Format</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Your CSV file should include the following columns:</p>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>subjectCode - Unique code for the subject (e.g., CS101)</li>
            <li>subjectName - Full name of the subject</li>
            <li>semester - Semester number (numeric)</li>
            <li>course - Course name or code</li>
          </ul>
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Example CSV format:</p>
            <pre className="bg-gray-100 p-3 rounded text-sm text-gray-700 overflow-x-auto">
              subjectCode,subjectName,semester,course
              CS101,Introduction to Programming,1,Computer Science
              MA201,Advanced Mathematics,2,Engineering
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubjects;
