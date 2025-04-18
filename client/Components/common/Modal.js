import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium',
    showCloseButton = true,
    closeOnEsc = true,
    closeOnOutsideClick = true
}) => {
    const modalRef = useRef();

    // Handle size classes
    const sizeClasses = {
        small: 'max-w-md',
        medium: 'max-w-lg',
        large: 'max-w-2xl',
        xlarge: 'max-w-4xl',
        full: 'max-w-full mx-4'
    };

    // Handle keyboard events (Escape key)
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (closeOnEsc && event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevent scrolling while modal is open
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = ''; // Re-enable scrolling when closed
        };
    }, [isOpen, onClose, closeOnEsc]);

    // Handle clicks outside the modal
    const handleOutsideClick = (e) => {
        if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    // Portal the modal to body to avoid z-index issues
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Background overlay */}
            <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={handleOutsideClick}
            ></div>

            <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
                {/* Modal panel */}
                <div
                    ref={modalRef}
                    className={`${sizeClasses[size]} relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 w-full`}
                >
                    {/* Modal header */}
                    {title && (
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                                {title}
                            </h3>
                            {showCloseButton && (
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    onClick={onClose}
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Modal content */}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal; 