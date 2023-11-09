const express = require("express");
const bcrypt = require('bcrypt');
const User = require('../models/user')
const router = express.Router();
const authSignIn = require('../controllers/authControllers')

// Create user
router.post('/signup', async (req, res) => {
    try{
        // Check if the email property exists in the request body
        if (!req.body.email) {
            return res.status(400).json({ error: 'Email is required in the request body' });
        }

        // Check if the password property exists in the request body
        if (!req.body.password) {
            return res.status(400).json({ error: 'Password is required in the request body' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if the email already exists in the database
        const existinUser = await User.findOne({ email: req.body.email });
        if (existinUser) {
            return res.status(400).json({ error: 'Email already exists in the database' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Validate status field
        const validStatusValues = ['Married', 'Single', 'Divorced'];
        if (!validStatusValues.includes(req.body.status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        // Validate age
        const age = parseInt(req.body.age);
        if (isNaN(age) || age <= 0 || age >= 150) {
            return res.status(400).json({ error: 'Invalid age value' });
        }

        // Validate other fields not longer than 25 characters
        const maxLength = 25;
        const fieldsToCheck = ['name', 'job', 'phone', 'city'];

        for (const field of fieldsToCheck) {
            if (req.body[field] && req.body[field].length > maxLength) {
                return res.status(400).json({ error: `${field} should not be longer than ${maxLength} characters` });
            }
        }

        const newUser = new User({
            ...req.body,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.post('/signin', authSignIn.signIn);
//get user info

module.exports = router;