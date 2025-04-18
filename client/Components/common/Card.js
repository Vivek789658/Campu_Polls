import React from 'react';

const Card = ({
    children,
    title,
    subtitle,
    icon,
    footer,
    onClick,
    className = '',
    padding = 'normal',
    elevation = 'md',
    hoverable = false,
    headerAction
}) => {
    const paddings = {
        none: '',
        small: 'p-3',
        normal: 'p-5',
        large: 'p-6'
    };

    const elevations = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow',
        lg: 'shadow-md',
        xl: 'shadow-lg'
    };

    const baseClasses = 'bg-white rounded-lg overflow-hidden';
    const hoverClasses = hoverable ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer' : '';

    return (
        <div
            className={`${baseClasses} ${elevations[elevation]} ${hoverClasses} ${className}`}
            onClick={onClick}
        >
            {/* Card Header */}
            {(title || subtitle || icon || headerAction) && (
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center">
                        {icon && <div className="mr-3">{icon}</div>}
                        <div>
                            {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
                            {subtitle && <div className="mt-0.5 text-sm text-gray-500">{subtitle}</div>}
                        </div>
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}

            {/* Card Body */}
            <div className={paddings[padding]}>
                {children}
            </div>

            {/* Card Footer */}
            {footer && (
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                    {footer}
                </div>
            )}
        </div>
    );
};

// Card.Header component for more complex headers
Card.Header = ({ children, className = '' }) => (
    <div className={`px-5 py-4 border-b border-gray-100 ${className}`}>
        {children}
    </div>
);

// Card.Body component for custom padding
Card.Body = ({ children, className = '' }) => (
    <div className={`p-5 ${className}`}>
        {children}
    </div>
);

// Card.Footer component
Card.Footer = ({ children, className = '' }) => (
    <div className={`px-5 py-3 bg-gray-50 border-t border-gray-100 ${className}`}>
        {children}
    </div>
);

export default Card; 