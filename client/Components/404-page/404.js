import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center bg-white rounded-xl shadow-lg p-8 md:p-10">
                <div className="inline-block mb-6">
                    <svg className="w-20 h-20 text-indigo-500 mx-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <h1 className="text-5xl font-bold text-gray-800 mb-3">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>

                <p className="text-gray-600 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <Link to="/">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                        Return to Home
                    </button>
                </Link>

                <div className="mt-6 text-gray-500 text-sm">
                    <p>Need help? <a href="/contact" className="text-indigo-600 hover:underline">Contact Support</a></p>
                </div>
            </div>
        </div>
    );
};

export default NotFound; 