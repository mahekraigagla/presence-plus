const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('../models/User'); // Assuming a User model exists
const router = express.Router();

// Serve the signup page
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/signup.html'));
});

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.redirect('/login'); // Redirect to login page after signup
    } catch (error) {
        console.error(error);
        res.status(500).send('Error signing up');
    }
});

module.exports = router;
