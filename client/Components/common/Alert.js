import React, { useState, useEffect } from 'react';

const Alert = ({
    type = 'info',
    message,
    title,
    dismissible = true,
    autoClose = false,
    autoCloseTime = 5000,
    onClose,
    className = ''
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let timer;
        if (autoClose && isVisible) {
            timer = setTimeout(() => {
                close();
            }, autoCloseTime);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [autoClose, autoCloseTime, isVisible]);

    const close = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    if (!isVisible) return null;

    // Alert configurations based on type
    const configs = {
        info: {
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-500',
            textColor: 'text-blue-700',
            icon: (
                <svg className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            )
        },
        success: {
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
            textColor: 'text-green-700',
            icon: (
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            )
        },
        warning: {
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-500',
            textColor: 'text-yellow-700',
            icon: (
                <svg className="w-5 h-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            )
        },
        error: {
            bgColor: 'bg-red-50',
            borderColor: 'border-red-500',
            textColor: 'text-red-700',
            icon: (
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            )
        }
    };

    const { bgColor, borderColor, textColor, icon } = configs[type];

    return (
        <div className={`rounded-md p-4 ${bgColor} border-l-4 ${borderColor} ${className}`} role="alert">
            <div className="flex">
                <div className="flex-shrink-0">{icon}</div>
                <div className="ml-3">
                    {title && <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>}
                    <div className={`text-sm ${textColor} ${title ? 'mt-2' : ''}`}>{message}</div>
                </div>
                {dismissible && (
                    <div className="ml-auto pl-3">
                        <div className="-mx-1.5 -my-1.5">
                            <button
                                type="button"
                                onClick={close}
                                className={`inline-flex rounded-md p-1.5 ${textColor} hover:${bgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type === 'info' ? 'blue' : type === 'success' ? 'green' : type === 'warning' ? 'yellow' : 'red'}-500`}
                            >
                                <span className="sr-only">Dismiss</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Alert; 