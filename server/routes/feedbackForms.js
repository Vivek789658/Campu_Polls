const express = require('express');
const router = express.Router();

// Mock data for demonstration - replace with your database queries
const feedbackForms = [
    {
        id: 'PLC_A',
        title: 'PLC • Section A',
        status: 'expired',
        startTime: '2025-04-09T09:50:00',
        deadline: '2025-04-11T09:51:00',
        questionCount: 3,
        formUrl: '/feedback/plc-a'
    },
    {
        id: 'SA_A',
        title: 'SA • Section A',
        status: 'expired',
        startTime: '2025-04-15T21:24:00',
        deadline: '2025-04-17T21:24:00',
        questionCount: 1,
        formUrl: '/feedback/sa-a'
    },
    {
        id: 'SAB_A',
        title: 'SAB • Section A',
        status: 'expired',
        startTime: '2025-04-17T15:37:00',
        deadline: '2025-04-18T15:38:00',
        questionCount: 1,
        formUrl: '/feedback/sab-a'
    },
    {
        id: 'SAP_A',
        title: 'SAP • Section A',
        status: 'expired',
        startTime: '2025-04-17T10:21:00',
        deadline: '2025-04-18T10:21:00',
        questionCount: 1,
        formUrl: '/feedback/sap-a'
    },
    {
        id: 'SAPC_E',
        title: 'SAPC • Section E',
        status: 'expired',
        startTime: '2025-04-18T17:07:00',
        deadline: '2025-04-20T17:07:00',
        questionCount: 4,
        formUrl: '/feedback/sapc-e'
    },
    {
        id: 'BA_A',
        title: 'BA • Section A',
        status: 'urgent',
        startTime: '2025-04-26T23:19:00',
        deadline: '2025-04-27T23:19:00',
        questionCount: 1,
        formUrl: '/feedback/ba-a'
    }
];

// Mock responses data - replace with your database
const mockResponses = {
    'PLC_A': [
        {
            id: 1,
            studentName: 'John Doe',
            subject: 'PLC',
            submissionDate: '2025-04-10T15:30:00',
            answers: [
                { question: 'How would you rate the course content?', answer: 'Excellent', rating: 5 },
                { question: 'Was the pace of teaching appropriate?', answer: 'Yes, it was perfect', rating: 4 },
                { question: 'Any suggestions for improvement?', answer: 'More practical examples would be helpful', rating: null }
            ]
        },
        {
            id: 2,
            studentName: 'Jane Smith',
            subject: 'PLC',
            submissionDate: '2025-04-10T16:45:00',
            answers: [
                { question: 'How would you rate the course content?', answer: 'Good', rating: 4 },
                { question: 'Was the pace of teaching appropriate?', answer: 'A bit fast', rating: 3 },
                { question: 'Any suggestions for improvement?', answer: 'More revision sessions', rating: null }
            ]
        }
    ]
};

// Get all feedback forms
router.get('/feedback-forms', (req, res) => {
    try {
        res.json(feedbackForms);
    } catch (error) {
        console.error('Error fetching feedback forms:', error);
        res.status(500).json({ message: 'Failed to fetch feedback forms' });
    }
});

// Get a specific feedback form by ID
router.get('/feedback-forms/:id', (req, res) => {
    try {
        const form = feedbackForms.find(f => f.id === req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Feedback form not found' });
        }
        res.json(form);
    } catch (error) {
        console.error('Error fetching feedback form:', error);
        res.status(500).json({ message: 'Failed to fetch feedback form' });
    }
});

// Get responses for a specific form
router.get('/feedback-forms/:id/responses', (req, res) => {
    try {
        const { id } = req.params;
        const responses = mockResponses[id] || [];
        res.json(responses);
    } catch (error) {
        console.error('Error fetching responses:', error);
        res.status(500).json({ message: 'Failed to fetch responses' });
    }
});

// Submit feedback response
router.post('/feedback-forms/:id/submit', (req, res) => {
    try {
        const { id } = req.params;
        const form = feedbackForms.find(f => f.id === id);

        if (!form) {
            return res.status(404).json({ message: 'Feedback form not found' });
        }

        if (form.status === 'expired') {
            return res.status(400).json({ message: 'Form submission deadline has passed' });
        }

        const response = {
            id: Date.now(),
            submissionDate: new Date().toISOString(),
            ...req.body
        };

        // In a real application, save this to your database
        if (!mockResponses[id]) {
            mockResponses[id] = [];
        }
        mockResponses[id].push(response);

        res.json({ message: 'Feedback submitted successfully', response });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Failed to submit feedback' });
    }
});

// Delete a feedback form
router.delete('/feedback-forms/:id', (req, res) => {
    try {
        const { id } = req.params;
        const formIndex = feedbackForms.findIndex(f => f.id === id);

        if (formIndex === -1) {
            return res.status(404).json({ message: 'Feedback form not found' });
        }

        feedbackForms.splice(formIndex, 1);
        delete mockResponses[id];

        res.json({ message: 'Feedback form deleted successfully' });
    } catch (error) {
        console.error('Error deleting feedback form:', error);
        res.status(500).json({ message: 'Failed to delete feedback form' });
    }
});

module.exports = router; 