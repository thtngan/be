const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require("dotenv").config();

async function signUp(req, res) {
    try {
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

        const numberRegrex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
        if (!numberRegrex.test(req.body.phone)) {
            return res.status(400).json({ error: 'Invalid phone number' });
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
        const fieldsToCheck = ['name', 'job', 'city'];

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
}

async function signIn(req, res) {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: 'Email or password incorrect' });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Email or password incorrect' });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { signUp, signIn };
