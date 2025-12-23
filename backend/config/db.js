const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URI)
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

