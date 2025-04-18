import React from 'react';

const Loading = ({ size = 'medium', fullScreen = false }) => {
    // Size variations
    const sizeClasses = {
        small: 'w-5 h-5',
        medium: 'w-8 h-8',
        large: 'w-12 h-12'
    };

    // Container classes based on fullScreen
    const containerClasses = fullScreen
        ? 'fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50'
        : 'flex items-center justify-center';

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center">
                <div className={`${sizeClasses[size]} text-indigo-600 animate-spin`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </div>
                {fullScreen && <p className="mt-4 text-indigo-600 font-medium">Loading...</p>}
            </div>
        </div>
    );
};

export default Loading; 