
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Automatically loads from .env file

const Cookie = require('./Models/cookie_type');

const mongoURI = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());

let data = JSON.parse(fs.readFileSync('./output.json', 'utf-8'));
console.log(data);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  await importData(); // Call the data import function here
  // Set up a change stream to monitor changes to the collection
  const changeStream = Cookie.watch();
  changeStream.on('change', (change) => {
    console.log('Change detected:', change);
    data = JSON.parse(fs.readFileSync('./output.json', 'utf-8'));
    importData();
  });
})
.catch((err) => console.error('Error connecting to MongoDB:', err));

app.get('/', (req, res) => {
  res.send({
    title: 'Hello, World!',
  });
});

app.put('/update/:cookieType', (req, res) => {
  const cookieTypeToUpdate = req.params.cookieType;
  const updatedData = req.body;
  // Update the data in the JSON file
  const updatedIndex = data.findIndex((item) => item.CookieType === cookieTypeToUpdate);
  if (updatedIndex !== -1) {
    data[updatedIndex] = { ...data[updatedIndex], ...updatedData };
    fs.writeFileSync('./output.json', JSON.stringify(data, null, 2));
    // Update the data in the MongoDB collection
    Cookie.updateOne({ CookieType: cookieTypeToUpdate }, updatedData)
      .then(() => {
        console.log('Data updated in MongoDB');
        res.send('Data updated successfully');
      })
      .catch((error) => {
        console.error('Error updating data in MongoDB:', error);
        res.status(500).send('Error updating data');
      });
  } else {
    res.status(404).send('Cookie type not found');
  }
});

const importData = async () => {
  try {
    await Cookie.deleteMany({}); // Clear the collection before importing
    await Cookie.insertMany(data); // Use insertMany to import the data
    console.log('Data successfully imported to MongoDB');
  } catch (error) {
    console.error('Error importing data:', error);
  }
};

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
