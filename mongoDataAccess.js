const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoURI = process.env.MONGODB_URL;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Cookie = require('./Models/cookie_type'); // Import your Mongoose model

// Function to fetch data from MongoDB
const fetchMongoData = async () => {
  try {
    const data = await Cookie.find({}); // Modify this query to fetch the specific data you need
    return data;
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    throw error;
  }
};

module.exports = { fetchMongoData };
