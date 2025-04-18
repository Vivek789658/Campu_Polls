import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    type = 'button',
    onClick,
    className = ''
}) => {
    // Base classes for all buttons
    const baseClasses = 'font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    // Variant classes
    const variantClasses = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
        secondary: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 focus:ring-indigo-400',
        success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        outlined: 'bg-transparent hover:bg-indigo-50 text-indigo-600 border border-indigo-600 focus:ring-indigo-400',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400'
    };

    // Size classes
    const sizeClasses = {
        small: 'py-1 px-3 text-sm',
        medium: 'py-2 px-4',
        large: 'py-3 px-6 text-lg'
    };

    // Disabled classes
    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';

    return (
        <button
            type={type}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${disabledClasses} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button; 