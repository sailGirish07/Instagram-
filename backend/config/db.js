const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async() => {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongodb connected: ${conn.connection.host}`);
};

module.exports = connectDb;

