const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
	name: String,
	email: {
        required: true,
        type: String
	},
    age: Number,
    status: String,
    job: String,
    phone: String,
    city: String,
    password: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('User', dataSchema)