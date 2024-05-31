
const mongoose = require('mongoose');
require('dotenv').config();

const atlasUri = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(atlasUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
