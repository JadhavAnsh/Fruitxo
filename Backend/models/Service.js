
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    icon: { type: String, required: true },  // Update icon type to String
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const Service = mongoose.model('Service', serviceSchema);  // Correct the model name

module.exports = Service;
