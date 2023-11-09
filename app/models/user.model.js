const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    _id: Number,
	name: {
        required: true,
        type: String
    },
	email: {
        required: true,
        type: String
	}
}, { _id: false })

module.exports = mongoose.model('User', dataSchema)