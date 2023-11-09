const express = require('express');
const Model = require('../models/user.model')
const router = express.Router();

//Get all Method
router.get('/', async (req, res) => {
    res.json({ message: "Welcome to application." });
})



module.exports = router;