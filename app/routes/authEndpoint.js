const express = require("express");
const bcrypt = require('bcrypt');
const User = require('../models/user')
const router = express.Router();
const auth = require('../controllers/authControllers')

router.post('/signup', async (req, res) => {
    try{
        if (!req.body.email) {
            return res.status(400).json({ error: 'Email is required in the request body' });
        }

        if (!req.body.password) {
            return res.status(400).json({ error: 'Password is required in the request body' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const existinUser = await User.findOne({ email: req.body.email });
        if (existinUser) {
            return res.status(400).json({ error: 'Email already exists in the database' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const validStatusValues = ['Married', 'Single', 'Divorced'];
        if (!validStatusValues.includes(req.body.status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const age = parseInt(req.body.age);
        if (isNaN(age) || age <= 0 || age >= 150) {
            return res.status(400).json({ error: 'Invalid age value' });
        }

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

router.post('/signin', auth.signIn);

module.exports = router;