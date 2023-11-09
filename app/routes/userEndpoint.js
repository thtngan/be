const express = require("express");
const bcrypt = require('bcrypt');
const User = require('../models/user')
const router = express.Router();


router.get('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'User not found' });
        }

        const userData = await User.findOne({ email }).select('-password');
        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(userData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Update user
router.put('/:email', async (req, res) => {
    try{
       
        const email = req.params.email;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Find the user by email in the database
        const userToUpdate = await User.findOne({ email });

        if (!userToUpdate) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user fields if provided in the request body
        if (req.body.name) {
            // Validate name length
            const maxLength = 25;
            if (req.body.name.length > maxLength) {
                return res.status(400).json({ error: `Name should not be longer than ${maxLength} characters` });
            }
            userToUpdate.name = req.body.name;
        }
        if (req.body.age) {
            // Validate age
            const age = parseInt(req.body.age);
            if (isNaN(age) || age <= 0 || age >= 150) {
                return res.status(400).json({ error: 'Invalid age value' });
            }
            userToUpdate.age = age;
        }
        if (req.body.status) {
            // Validate status value
            const validStatusValues = ['Married', 'Single', 'Divorced'];
            if (!validStatusValues.includes(req.body.status)) {
                return res.status(400).json({ error: 'Invalid status value' });
            }
            userToUpdate.status = req.body.status;
        }
        if (req.body.job) {
            // Validate job length
            const maxLength = 25;
            if (req.body.job.length > maxLength) {
                return res.status(400).json({ error: `Job should not be longer than ${maxLength} characters` });
            }
            userToUpdate.job = req.body.job;
        }
        if (req.body.phone) {
            // Validate phone length
            const maxLength = 25;
            if (req.body.phone.length > maxLength) {
                return res.status(400).json({ error: `Phone should not be longer than ${maxLength} characters` });
            }
            userToUpdate.phone = req.body.phone;
        }
        if (req.body.city) {
            // Validate city length
            const maxLength = 25;
            if (req.body.city.length > maxLength) {
                return res.status(400).json({ error: `City should not be longer than ${maxLength} characters` });
            }
            userToUpdate.city = req.body.city;
        }

        // Update the password if provided in the request body
        if (req.body.password) {
            // Hash the new password before updating it
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            userToUpdate.password = hashedPassword;
        }

        // Save the updated user data
        const updatedUser = await userToUpdate.save();

        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
})

module.exports = router;