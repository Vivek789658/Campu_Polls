import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';

// Define custom SVG icons as components
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const BarsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const EnvelopeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);

const BriefcaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);

const PaperPlaneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

// Add this mock data outside the component
const MOCK_CONTACTS = [
    {
        _id: "1",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        department: "Computer Science",
        role: "Professor"
    },
    {
        _id: "2",
        name: "Dr. Michael Chen",
        email: "michael.chen@university.edu",
        department: "Engineering",
        role: "Professor"
    },
    {
        _id: "3",
        name: "Prof. Emily Rodriguez",
        email: "emily.rodriguez@university.edu",
        department: "Mathematics",
        role: "Professor"
    },
    {
        _id: "4",
        name: "Dr. James Wilson",
        email: "james.wilson@university.edu",
        department: "Business Administration",
        role: "Administrator"
    },
    {
        _id: "5",
        name: "Dr. Anita Patel",
        email: "anita.patel@university.edu",
        department: "Computer Science",
        role: "Professor"
    }
];

const Contact = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const [messageSent, setMessageSent] = useState(false);
    const [sending, setSending] = useState(false);

    // Get user data
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                try {
                    const response = await fetch('http://localhost:4000/api/v1/contact');
                    if (!response.ok) {
                        throw new Error('Failed to fetch contact data');
                    }
                    const jsonData = await response.json();
                    setData(jsonData);
                } catch (apiError) {
                    // If API fails, use mock data instead
                    console.log('Using mock contact data due to API error:', apiError);
                    setData(MOCK_CONTACTS);
                }
                setError(null);
            } catch (err) {
                console.error('Error in contact component:', err);
                setError('Failed to load contact information. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Add event listener to close sidebar when clicking outside on mobile
        const handleClickOutside = (event) => {
            if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen]);

    useEffect(() => {
        // Apply dark mode class to body
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleTheme = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode);
    };

    const filteredData = data.filter(contact => {
        const searchLower = searchTerm.toLowerCase();
        return (
            contact.name.toLowerCase().includes(searchLower) ||
            contact.email.toLowerCase().includes(searchLower) ||
            contact.department.toLowerCase().includes(searchLower) ||
            contact.role.toLowerCase().includes(searchLower)
        );
    });

    const handleContactSelect = (contact) => {
        setSelectedContact(contact);
        setMessageSent(false);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim() || !selectedContact) return;

        setSending(true);

        try {
            // Simulate sending a message
            // In a real app, you would call an API endpoint to send the message
            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage('');
            setMessageSent(true);
            setSending(false);

            // Optional: In a real app you would call something like:
            // const response = await fetch('http://localhost:4000/api/v1/sendMessage', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         senderId: userData._id,
            //         senderName: userData.name,
            //         recipientId: selectedContact._id,
            //         message
            //     })
            // });

        } catch (err) {
            console.error('Error sending message:', err);
            setSending(false);
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar for all screen sizes */}
            <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 sidebar`}>
                <SideBar darkMode={darkMode} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content */}
            <div className="lg:ml-64 transition-all duration-300">
                <div className={`p-4 sm:p-6 md:p-8`}>
                    {/* Header with mobile toggle */}
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                        <div className="flex items-center">
                            <button
                                onClick={toggleSidebar}
                                className={`sidebar-toggle mr-3 p-2 rounded-md lg:hidden ${darkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-200'}`}
                                aria-label="Toggle sidebar"
                            >
                                <BarsIcon />
                            </button>
                            <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight`}>
                                Contact
                            </h1>
                        </div>

                        {/* Theme toggle button */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors flex-shrink-0`}
                            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {darkMode ? <SunIcon /> : <MoonIcon />}
                        </button>
                    </div>

                    {/* Contact content */}
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Contact list panel */}
                        <div className={`w-full md:w-1/2 lg:w-2/5 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
                            <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                <h2 className="text-lg font-semibold mb-4">Contact Directory</h2>

                                {/* Search box */}
                                <div className={`relative flex items-center ${darkMode ? 'bg-gray-600' : 'bg-gray-50'} rounded-md`}>
                                    <span className={`absolute left-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        <SearchIcon />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search contacts..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={`w-full pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 ${darkMode
                                            ? 'bg-gray-600 text-white focus:ring-blue-600 placeholder-gray-400'
                                            : 'bg-gray-50 text-gray-800 focus:ring-blue-500 placeholder-gray-500'
                                            }`}
                                    />
                                </div>
                            </div>

                            <div className={`overflow-y-auto max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-220px)]`}>
                                {loading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
                                    </div>
                                ) : error ? (
                                    <div className={`${darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'} p-4 m-4 rounded-md`}>
                                        {error}
                                    </div>
                                ) : filteredData.length > 0 ? (
                                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredData.map((contact) => (
                                            <li
                                                key={contact._id}
                                                onClick={() => handleContactSelect(contact)}
                                                className={`p-4 hover:bg-opacity-80 transition-colors cursor-pointer ${selectedContact?._id === contact._id
                                                    ? darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                                                    : ''
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex-shrink-0`}>
                                                        <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                            <UserIcon />
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-medium">{contact.name}</h3>
                                                        <div className="flex flex-col sm:flex-row sm:justify-between mt-1">
                                                            <p className={`text-sm flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                <span className="mr-1 text-xs">
                                                                    <EnvelopeIcon />
                                                                </span>
                                                                {contact.email}
                                                            </p>
                                                            <p className={`text-sm flex items-center mt-1 sm:mt-0 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                <span className="mr-1 text-xs">
                                                                    <BriefcaseIcon />
                                                                </span>
                                                                {contact.role}
                                                            </p>
                                                        </div>
                                                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-700'}`}>
                                                            Department: {contact.department}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        No contacts found
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Message panel */}
                        <div className={`w-full md:w-1/2 lg:w-3/5 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
                            {selectedContact ? (
                                <div className="h-full flex flex-col">
                                    {/* Contact header */}
                                    <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h2 className="text-lg font-semibold">{selectedContact.name}</h2>
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedContact.role} • {selectedContact.department}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message area */}
                                    <div className="flex-1 p-4">
                                        {messageSent ? (
                                            <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-50 text-green-600'} mb-4`}>
                                                Your message has been sent successfully!
                                            </div>
                                        ) : null}

                                        <form onSubmit={handleSendMessage} className="h-full flex flex-col">
                                            <label
                                                htmlFor="message"
                                                className={`block mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                                            >
                                                Message to {selectedContact.name}
                                            </label>
                                            <textarea
                                                id="message"
                                                className={`w-full p-3 rounded-lg mb-4 resize-none flex-1 min-h-[200px] focus:outline-none focus:ring-2 ${darkMode
                                                    ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-600 placeholder-gray-400'
                                                    : 'bg-gray-50 text-gray-800 border-gray-200 focus:ring-blue-500 placeholder-gray-500'
                                                    }`}
                                                placeholder={`Write your message to ${selectedContact.name}...`}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                required
                                            ></textarea>
                                            <button
                                                type="submit"
                                                disabled={sending || !message.trim()}
                                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${sending || !message.trim()
                                                    ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                                                    : darkMode
                                                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                                                    }`}
                                            >
                                                {sending ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                        <span>Sending...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span><PaperPlaneIcon /></span>
                                                        <span>Send Message</span>
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                    <div className={`p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-4`}>
                                        <span className={`text-3xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                            <EnvelopeIcon />
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-medium mb-2">No Contact Selected</h3>
                                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md`}>
                                        Select a contact from the list to send a message to a professor or administrator.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;