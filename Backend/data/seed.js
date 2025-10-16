const mongoose = require('mongoose');
const Fruit = require('../models/Fruit'); // Import the Fruit model
const connectToMongo = require('../db'); // Import the database connection function

const fruits = [
    {
        id: 1,
        name: "Fresh Oranges",
        description: "Sweet and juicy oranges, perfect for snacking or juicing. Rich in Vitamin C and freshly harvested.",
        price: 4.99,
        unit: "per kg",
        image: "https://thumbs.dreamstime.com/b/sliced-orange-fruit-leaves-isolated-white-23331258.jpg"
    },
    {
        id: 2,
        name: "Premium Grapes",
        description: "Succulent black grapes, carefully selected for the perfect blend of sweetness. Perfect for snacks.",
        price: 6.99,
        unit: "per kg",
        image: "https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg"
    },
    {
        id: 3,
        name: "Red Apple",
        description: "Crisp and sweet red apples, locally sourced and perfect for any time of day.",
        price: 3.99,
        unit: "per kg",
        image: "https://plus.unsplash.com/premium_photo-1667049292983-d2524dd0ef08?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXBwbGVzfGVufDB8fDB8fHww"
    },
    {
        id: 4,
        name: "Fresh Strawberries",
        description: "Vibrant red strawberries, bursting with flavor and perfect for desserts.",
        price: 7.99,
        unit: "per box",
        image: "https://clv.h-cdn.co/assets/15/22/2560x1728/gallery-1432664914-strawberry-facts1.jpg"
    }
];

// Function to insert fruits data into MongoDB
const insertFruits = async () => {
    await connectToMongo(); // Connect to MongoDB

    try {
        await Fruit.insertMany(fruits); // Insert the fruits data
        console.log('Fruits data inserted successfully!');
    } catch (err) {
        console.error('Error inserting fruits data:', err.message);
    } finally {
        mongoose.connection.close(); // Close the connection after insertion
    }
};

insertFruits();