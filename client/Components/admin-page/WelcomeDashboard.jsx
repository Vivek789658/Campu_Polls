import React, { useState, useEffect } from 'react';
import { FaUsers, FaChalkboardTeacher, FaBook, FaClipboardList } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import FormStatistics from './FormStatistics';

const WelcomeDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalProfessors: 0,
        totalSubjects: 0,
        totalForms: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [studentsRes, professorsRes, subjectsRes, formsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/getAllStudents`),
                axios.get(`${API_BASE_URL}/getAllProfessors`),
                axios.get(`${API_BASE_URL}/getAllSubjects`),
                axios.get(`${API_BASE_URL}/getAllFeedbackForms`)
            ]);

            setStats({
                totalStudents: studentsRes.data.length,
                totalProfessors: professorsRes.data.length,
                totalSubjects: subjectsRes.data.length,
                totalForms: formsRes.data.length
            });

            // Process recent activity from forms
            const recentForms = formsRes.data
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(form => ({
                    id: form._id,
                    title: form.title,
                    type: 'form',
                    date: new Date(form.createdAt).toLocaleDateString(),
                    status: new Date(form.deadline) > new Date() ? 'active' : 'closed'
                }));

            setRecentActivity(recentForms);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Unable to connect to the server. Please check if the server is running.');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to the Dashboard</h1>
            
            {/* Form Statistics */}
            <FormStatistics />

            {/* Overview Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <FaUsers className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Students</p>
                            <p className="text-2xl font-semibold text-gray-800">{stats.totalStudents}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <FaChalkboardTeacher className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Professors</p>
                            <p className="text-2xl font-semibold text-gray-800">{stats.totalProfessors}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <FaBook className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Subjects</p>
                            <p className="text-2xl font-semibold text-gray-800">{stats.totalSubjects}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <FaClipboardList className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Forms</p>
                            <p className="text-2xl font-semibold text-gray-800">{stats.totalForms}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {recentActivity.map(activity => (
                        <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <FaClipboardList className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium text-gray-800">{activity.title}</p>
                                    <p className="text-sm text-gray-500">Created on {activity.date}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                activity.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {activity.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WelcomeDashboard; 