const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require('dotenv').config();


const MONGO_URL = process.env.MONGO_URL
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log(`Database running ${mongoose.connection.host}`);
    } catch (error) {
        console.log('Database connection error');
    }
}

module.exports = connectDB;