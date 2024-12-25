
const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    image: { type: String, required: true },
});

const Fruit = mongoose.model('Fruit', fruitSchema);

module.exports = Fruit;
