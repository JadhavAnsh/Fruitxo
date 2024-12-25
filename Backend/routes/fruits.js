
const express = require('express');
const Fruit = require('../models/Fruit.js'); // Import the Fruit model

const router = express.Router();

router.get('/fruits', async (req, res) => {
    try {
        const fruits = await Fruit.find(); // Find all fruits in the database
        res.json(fruits); // Send the fruits data as a response
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch fruits data' });
    }
});

module.exports = router;
