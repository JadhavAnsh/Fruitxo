// seeds/seedServices.js
const mongoose = require('mongoose');
const Service = require('./models/Service');  // Correct import path to Service model
const connectToMongo = require('./db'); // Ensure you have the connection set up in db.js

const services = [
    {
      icon: '🍊',
      title: 'Orange',
      description:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
    },
    {
      icon: '🍇',
      title: 'Grapes',
      description:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
    },
    {
      icon: '🍈',
      title: 'Guava',
      description:
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
    },
];

// Connect to MongoDB and insert the services
const seedServices = async () => {
  try {
    await connectToMongo();
    await Service.insertMany(services);
    console.log('Services successfully added to the database!');
    mongoose.connection.close(); // Close the connection after insertion
  } catch (error) {
    console.error('Error inserting services: ', error);
  }
};

// Run the seeding function
seedServices();
