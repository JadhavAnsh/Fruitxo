const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/api/verify-token', authenticateToken, (req, res) => {
    res.status(200).json({ valid: true });
});


router.post('/contact', authenticateToken, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        const contact = new Contact({
            ...req.body,
            userId: req.user._id
        });

        await contact.save();

        res.status(201).json({
            success: true,
            message: 'Message sent successfully'
        });

    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
});

module.exports = router;
