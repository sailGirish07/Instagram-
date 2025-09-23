const mongoose = require("mongoose");
require("dotenv").config();

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongodb connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection err", err);
  }
};

module.exports = connectDb;
