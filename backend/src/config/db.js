const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(config.dbUri);
    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Thoát tiến trình nếu không thể kết nối DB
    process.exit(1);
  }
};

module.exports = connectDB;