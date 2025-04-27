const express = require('express');
const router = express.Router();
const Student = require('../models/studentsScheema');
const Professor = require('../models/professorsScheema');
const Subject = require('../models/subjectsScheema');
const FeedbackForm = require('../models/FeedbackFormScheema');

// Get total number of students
router.get('/students/count', async (req, res) => {
    try {
        const count = await Student.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error('Error getting student count:', error);
        res.status(500).json({ error: 'Failed to get student count' });
    }
});

// Get total number of professors
router.get('/professors/count', async (req, res) => {
    try {
        const count = await Professor.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error('Error getting professor count:', error);
        res.status(500).json({ error: 'Failed to get professor count' });
    }
});

// Get total number of subjects
router.get('/subjects/count', async (req, res) => {
    try {
        const count = await Subject.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error('Error getting subject count:', error);
        res.status(500).json({ error: 'Failed to get subject count' });
    }
});

// Get total number of feedback forms
router.get('/feedback-forms/count', async (req, res) => {
    try {
        const count = await FeedbackForm.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error('Error getting feedback form count:', error);
        res.status(500).json({ error: 'Failed to get feedback form count' });
    }
});

module.exports = router; 