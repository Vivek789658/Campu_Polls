import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const FormStatistics = () => {
    const [stats, setStats] = useState({
        totalForms: 0,
        activeForms: 0,
        pendingForms: 0,
        closedForms: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFormStatistics();
    }, []);

    const fetchFormStatistics = async () => {
        try {
            console.log('Fetching from:', `${API_BASE_URL}/getFormStatistics`);
            const response = await axios.get(`${API_BASE_URL}/getFormStatistics`);
            console.log('Server response:', response.data);
            
            if (response.data.success) {
                const { statistics } = response.data;
                setStats({
                    totalForms: statistics.total,
                    activeForms: statistics.active,
                    pendingForms: statistics.pending,
                    closedForms: statistics.closed
                });
            } else {
                setError('Failed to retrieve statistics');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                url: error.config?.url
            });
            setError('Unable to connect to the server. Please check if the server is running.');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                        <FaClipboardList className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Forms</p>
                        <p className="text-2xl font-semibold text-gray-800">{stats.totalForms}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full">
                        <FaCheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Forms</p>
                        <p className="text-2xl font-semibold text-gray-800">{stats.activeForms}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-full">
                        <FaClock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pending Forms</p>
                        <p className="text-2xl font-semibold text-gray-800">{stats.pendingForms}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                    <div className="p-3 bg-red-100 rounded-full">
                        <FaTimesCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Closed Forms</p>
                        <p className="text-2xl font-semibold text-gray-800">{stats.closedForms}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormStatistics; 