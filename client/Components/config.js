// // API URL Configuration
// const API_URL = process.env.REACT_APP_API_URL || 'https://campu-polls.onrender.com';
// const API_BASE_URL = `${API_URL}/api/v1`;

// export { API_URL, API_BASE_URL }; 

// API URL Configuration
// const API_URL = process.env.REACT_APP_API_URL || 'https://pr-01.onrender.com';
// const API_BASE_URL = `${API_URL}/api/v1`;

// export { API_URL, API_BASE_URL }; 



// API URL Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_BASE_URL = `${API_URL}/api/v1`;

// Add admin routes
const ADMIN_ROUTES = {
    base: '/admin',
    feedback: '/admin/feedback',
    editForm: '/admin/edit-feedback-form'
};

export { API_URL, API_BASE_URL, ADMIN_ROUTES };
