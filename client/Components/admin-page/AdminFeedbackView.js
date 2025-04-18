import React, { useState, useEffect } from 'react';
import { FaUserGraduate, FaComments, FaFileExcel, FaChartBar, FaSearch, FaFilter, FaCalendarAlt, FaStar, FaDownload, FaSync } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const BASE_URL = "http://192.168.92.153:4000/api/v1";

const AdminFeedbackView = () => {
    const [feedbackForms, setFeedbackForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [responses, setResponses] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [studentDetails, setStudentDetails] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [stats, setStats] = useState({
        totalResponses: 0,
        averageRating: 0,
        completionRate: 0,
        recentSubmissions: 0,
        lastUpdateTime: new Date()
    });

    useEffect(() => {
        fetchFeedbackForms();
    }, []);

    const fetchFeedbackForms = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${BASE_URL}/getAllFeedbackForms`);
            if (!response.ok) throw new Error('Failed to fetch forms');

            const data = await response.json();
            console.log("Feedback forms:", data);

            if (data.feedbackForms && Array.isArray(data.feedbackForms)) {
                setFeedbackForms(data.feedbackForms);
                // Automatically select and load the first form's responses
                if (data.feedbackForms.length > 0) {
                    await fetchResponses(data.feedbackForms[0]);
                }
            } else {
                console.error("Unexpected data format:", data);
                setFeedbackForms([]);
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            setError('Failed to fetch feedback forms');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchResponses = async (form) => {
        try {
            setIsRefreshing(true);
            setError(null);

            // Fetch form details to get questions
            const formResponse = await fetch(`${BASE_URL}/getFeedbackForm/${form.name}`);
            if (!formResponse.ok) throw new Error('Failed to fetch form details');
            const formData = await formResponse.json();
            console.log("Form data:", formData);
            const formQuestions = formData.feedbackForm?.questions?.map(q => q.description) || [];
            setQuestions(formQuestions);

            // Try to fetch real responses using multiple endpoint formats
            console.log("Attempting to fetch responses for form:", form.name);
            let responseData = null;
            let fetchSuccess = false;

            // Try different API endpoints until we get a successful response
            const endpointsToTry = [
                `${BASE_URL}/getFeedbackResponses/${form.name}`,
                `${BASE_URL}/getfeedbackResponses/${form.name}`,
                `${BASE_URL}/getFeedbackResponses/${form._id}`,
                `${BASE_URL}/getfeedbackresponses/${form.name.toLowerCase()}`,
                `${BASE_URL}/getSubmittedFeedback/${form.name}`
            ];

            for (const endpoint of endpointsToTry) {
                try {
                    console.log(`Trying endpoint: ${endpoint}`);
                    const response = await fetch(endpoint);
                    if (response.ok) {
                        responseData = await response.json();
                        console.log("Successfully fetched response data:", responseData);
                        fetchSuccess = true;
                        break;
                    }
                } catch (endpointError) {
                    console.log(`Endpoint ${endpoint} failed:`, endpointError);
                }
            }

            // If all direct fetches failed, try to get all responses and filter
            if (!fetchSuccess) {
                console.log("All direct fetches failed, trying to get all responses...");
                try {
                    const allResponse = await fetch(`${BASE_URL}/getAllFeedbackResponses`);
                    if (allResponse.ok) {
                        const allData = await allResponse.json();
                        console.log("All feedback data:", allData);

                        if (allData && (Array.isArray(allData) || allData.responses || allData.feedbackResponses)) {
                            responseData = allData;
                            fetchSuccess = true;
                        }
                    }
                } catch (allError) {
                    console.log("Failed to fetch all responses:", allError);
                }
            }

            // Process the response data based on its structure
            let responseArray = [];
            if (fetchSuccess) {
                if (Array.isArray(responseData)) {
                    responseArray = responseData;
                } else if (responseData?.responses && Array.isArray(responseData.responses)) {
                    responseArray = responseData.responses;
                } else if (responseData?.feedbackResponses && Array.isArray(responseData.feedbackResponses)) {
                    responseArray = responseData.feedbackResponses;
                } else if (typeof responseData === 'object' && responseData !== null) {
                    // Look for any array property in the response
                    const possibleArrays = Object.values(responseData).filter(v => Array.isArray(v));
                    if (possibleArrays.length > 0) {
                        responseArray = possibleArrays[0];
                    } else if (responseData.answers) {
                        // Handle single response object
                        responseArray = [responseData];
                    }
                }

                // If we got all responses, filter for this form
                if (fetchSuccess && !fetchSuccess.directFetch && responseArray.length > 0) {
                    console.log("Filtering all responses for this form");
                    responseArray = responseArray.filter(r =>
                        r.formName === form.name ||
                        r.feedbackFormName === form.name ||
                        r.formId === form._id
                    );
                }
            }

            console.log(`Found ${responseArray.length} dynamic responses for the form`);

            if (responseArray.length > 0) {
                // Use real data
                setResponses(responseArray);

                // Calculate stats from real data
                const totalResponses = responseArray.length;
                const recentSubmissions = responseArray.filter(r =>
                    r.submittedAt && new Date(r.submittedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length;

                let averageRating = 0;
                if (totalResponses > 0) {
                    const ratingQuestions = responseArray.flatMap(r =>
                        (r.answers || []).filter(a => !isNaN(parseInt(a)))
                    );
                    if (ratingQuestions.length > 0) {
                        averageRating = ratingQuestions.reduce((a, b) => a + parseInt(b), 0) / ratingQuestions.length;
                    }
                }

                setStats({
                    totalResponses,
                    averageRating: averageRating.toFixed(1),
                    completionRate: ((totalResponses / (form.totalStudents || 100)) * 100).toFixed(1),
                    recentSubmissions,
                    lastUpdateTime: new Date()
                });

                // Fetch student details if we have responses
                try {
                    const studentIds = [...new Set(responseArray.map(response => response.studentId).filter(Boolean))];
                    if (studentIds.length > 0) {
                        const studentsResponse = await fetch(`${BASE_URL}/getStudentsDetails`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ studentIds })
                        });
                        if (studentsResponse.ok) {
                            const studentsData = await studentsResponse.json();
                            setStudentDetails(studentsData.students || []);
                        }
                    }
                } catch (studentError) {
                    console.error('Error fetching student details:', studentError);
                }
            } else {
                // No dynamic data found, show empty state
                setResponses([]);
                setStats({
                    totalResponses: 0,
                    averageRating: "0.0",
                    completionRate: "0.0",
                    recentSubmissions: 0,
                    lastUpdateTime: new Date()
                });
                console.log("No responses found for this form");
            }

            setSelectedForm(form);
        } catch (error) {
            setError('Failed to fetch responses: ' + error.message);
            console.error('Error:', error);
            setResponses([]);
        } finally {
            setIsRefreshing(false);
            setLoading(false);
        }
    };

    // Function to periodically refresh data
    useEffect(() => {
        // Set up periodic refresh if form is selected
        let refreshInterval;
        if (selectedForm) {
            refreshInterval = setInterval(() => {
                console.log("Auto-refreshing data...");
                fetchResponses(selectedForm);
            }, 30000); // Refresh every 30 seconds
        }

        // Clean up interval on unmount or form change
        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, [selectedForm]);

    const handleRefresh = () => {
        if (selectedForm) {
            fetchResponses(selectedForm);
        }
    };

    const exportToExcel = () => {
        if (!responses || !responses.length) {
            alert("No data available to export!");
            return;
        }

        try {
            // Prepare headers based on questions
            const headers = [
                'Student ID',
                'Student Name',
                'Email',
                'Branch',
                'Semester',
                'Section',
                'Submission Date',
                ...questions.map((q, idx) => `Question ${idx + 1}: ${q}`)
            ];

            // Prepare data rows
            const data = responses.map(response => {
                const submissionDate = new Date(response.submittedAt).toLocaleString();
                const studentInfo = studentDetails.find(s => s.studentId === response.studentId) || {};

                return [
                    response.studentId || 'N/A',
                    studentInfo.name || response.answers[0] || 'N/A',
                    studentInfo.email || response.answers[1] || 'N/A',
                    studentInfo.branch || response.answers[2] || 'N/A',
                    studentInfo.semester || response.answers[3] || 'N/A',
                    studentInfo.section || response.answers[4] || 'N/A',
                    submissionDate,
                    ...response.answers.slice(5)  // Get all question answers
                ];
            });

            const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Feedback Responses');
            XLSX.writeFile(wb, `${selectedForm.name}_responses.xlsx`);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Failed to export data. Please try again.');
        }
    };

    const getFormDetails = (formName) => {
        if (!formName) return { subjectCode: 'N/A', section: 'N/A' };

        // Split by underscore and handle different formats
        const parts = formName.split('_');
        if (parts.length < 2) return { subjectCode: formName, section: 'N/A' };

        // Extract subject code and section
        const section = parts[parts.length - 1];
        const subjectCode = parts.slice(0, -1).join('_');

        return {
            subjectCode: subjectCode || 'N/A',
            section: section || 'N/A'
        };
    };

    const filteredForms = feedbackForms.filter(form =>
        form.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === 'all' ||
            (filterStatus === 'active' && new Date(form.deadline) > new Date()) ||
            (filterStatus === 'completed' && new Date(form.deadline) <= new Date()))
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
                <p className="mt-2 text-gray-600">View and analyze student feedback responses</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filter Section */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Search feedback forms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex-shrink-0">
                    <select
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Forms</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Forms Selection */}
            <div className="mb-6">
                <h2 className="text-lg font-medium mb-3">Select Feedback Form</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredForms.map((form) => (
                        <div
                            key={form._id}
                            onClick={() => fetchResponses(form)}
                            className={`transform transition-all duration-200 cursor-pointer rounded-xl shadow-sm hover:shadow-md ${selectedForm?._id === form._id
                                ? 'bg-indigo-50 border-2 border-indigo-500'
                                : 'bg-white border border-gray-200'
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-md font-semibold text-gray-900">{form.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${new Date(form.deadline) > new Date()
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {new Date(form.deadline) > new Date() ? 'Active' : 'Completed'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
            )}

            {selectedForm && !loading && (
                <div className="bg-white rounded-xl shadow-lg">
                    {/* Stats Section */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {selectedForm.name}
                                </h2>
                                <div className="flex items-center space-x-4">
                                    {(() => {
                                        const { subjectCode, section } = getFormDetails(selectedForm.name);
                                        return (
                                            <>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    Subject Code: {subjectCode}
                                                </span>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                                    Section: {section}
                                                </span>
                                            </>
                                        );
                                    })()}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Last updated: {new Date(stats.lastUpdateTime).toLocaleString()}
                                    <span className="ml-1 text-indigo-500">(Auto-refreshes every 30 seconds)</span>
                                </p>
                            </div>
                            <div className="flex gap-3 mt-4 sm:mt-0">
                                <button
                                    onClick={handleRefresh}
                                    className={`inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${isRefreshing ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    disabled={isRefreshing}
                                >
                                    <FaSync className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                                </button>
                                <button
                                    onClick={exportToExcel}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-150 ease-in-out"
                                >
                                    <FaDownload className="mr-2" />
                                    Export to Excel
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-indigo-50 rounded-lg p-4 transform transition-all duration-300 hover:scale-105">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                        <FaUserGraduate className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Responses</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.totalResponses}
                                            <span className="text-sm text-gray-500 ml-2">
                                                of {selectedForm.totalStudents || 'N/A'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4 transform transition-all duration-300 hover:scale-105">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                        <FaStar className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Average Rating</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.averageRating}
                                            <span className="text-sm text-gray-500 ml-2">/ 5</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-4 transform transition-all duration-300 hover:scale-105">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                                        <FaChartBar className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.completionRate}%
                                        </p>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-purple-500 h-2 rounded-full"
                                                style={{ width: `${Math.min(parseFloat(stats.completionRate), 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-50 rounded-lg p-4 transform transition-all duration-300 hover:scale-105">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                                        <FaCalendarAlt className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Recent (7 days)</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {stats.recentSubmissions}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Student Responses Table */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Student Responses</h3>
                            <span className="text-sm text-gray-500">
                                Showing {responses.length} responses
                                {error ? " (demo data)" : " from database"}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            {responses && responses.length > 0 ? (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Student Details
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Branch/Sem
                                            </th>
                                            {questions.length > 0 ?
                                                questions.map((question, index) => (
                                                    <th
                                                        key={index}
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                        title={question}
                                                    >
                                                        Q{index + 1}: {question.length > 20 ? `${question.substring(0, 20)}...` : question}
                                                    </th>
                                                )) :
                                                // If no questions loaded, create generic question headers based on remaining answers
                                                responses[0].answers.slice(5).map((_, index) => (
                                                    <th
                                                        key={index}
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        Question {index + 1}
                                                    </th>
                                                ))
                                            }
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Submitted At
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {responses.map((response, index) => {
                                            if (!response || !response.answers) {
                                                console.log("Invalid response at index", index, response);
                                                return null;
                                            }

                                            return (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                    <FaUserGraduate className="h-6 w-6 text-gray-500" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {response.answers[0] || 'N/A'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    ID: {response.studentId || 'N/A'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.answers[1] || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.answers[2] || 'N/A'} / {response.answers[3] || 'N/A'}
                                                    </td>
                                                    {response.answers.slice(5).map((answer, answerIndex) => (
                                                        <td key={answerIndex} className="px-6 py-4 text-sm text-gray-500">
                                                            {answer || 'N/A'}
                                                        </td>
                                                    ))}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {response.submittedAt ? new Date(response.submittedAt).toLocaleString() : 'N/A'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-12">
                                    <FaComments className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No responses yet</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        No students have submitted feedback for this form yet. Responses will appear here automatically when submitted.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFeedbackView; 