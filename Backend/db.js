const mongoose = require('mongoose');

const mongoDBURL = "mongodb+srv://jadhavansh10:kaCpqJp9VAsTgfV8@cluster0.jgvtmtz.mongodb.net/fruit-xo";

const connectToMongo = async () => {
    try {
        if (!mongoDBURL) {
            throw new Error('MONGODB_URI is not defined in the .env file');
        }
        await mongoose.connect(mongoDBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connection Successful");
    } catch (err) {
        console.error("Connection Error:", err.message);
    }
};

module.exports = connectToMongo;
