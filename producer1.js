// const kafka = require('kafka-node');
// const Producer = kafka.Producer;
// const KafkaClient = kafka.KafkaClient;

// const { fetchMongoData } = require('./mongoDataAccess'); // Import the MongoDB data access module

// // Kafka broker configuration
// const kafkaClient = new KafkaClient({ kafkaHost: 'localhost:9092' });
// const producer = new Producer(kafkaClient);

// // MongoDB connection URL
// const mongoUrl = 'mongodb://localhost:27017';

// // Function to fetch data from MongoDB and send it to Kafka
// const fetchDataAndSendToKafka = async (kafkaTopic) => {
//   try {
//     const data = await fetchMongoData();
//     if (data && data.length > 0) {
//       // Send data to Kafka
//       const payloads = data.map((item, index) => ({
//         topic: kafkaTopic,
//         messages: JSON.stringify(item),
//         key: String(index),
//       }));

//       producer.send(payloads, (err, data) => {
//         if (err) {
//           console.error('Error sending data to Kafka:', err);
//         } else {
//           console.log('Messages sent to Kafka:', payloads.length);
//         }
//       });
//     } else {
//       console.warn('No data found in MongoDB.');
//     }
//   } catch (error) {
//     console.error('Error fetching or sending data:', error);
//   }
// };

// // Kafka producer ready event
// producer.on('ready', () => {
//   console.log('Kafka producer is ready.');

//   // Fetch data from MongoDB and send it to Kafka at regular intervals
//   const kafkaTopic = 'myTopic'; // Define the Kafka topic here
//   setInterval(() => {
//     fetchDataAndSendToKafka(kafkaTopic); // Pass the Kafka topic as a parameter
//   }, 5000); // Adjust the interval as needed
// });

// // Handle Kafka producer errors
// producer.on('error', (err) => {
//   console.error('Kafka producer error:', err);
// });

// // Close the Kafka producer when the application exits
// process.on('SIGINT', () => {
//   producer.close(() => {
//     console.log('Kafka producer has been closed.');
//     process.exit();
//   });
// });



const kafka = require('kafka-node');
const Producer = kafka.Producer;
const KafkaClient = kafka.KafkaClient;

const { fetchMongoData } = require('./mongoDataAccess'); // Import the MongoDB data access module

// Kafka broker configuration
const kafkaClient = new KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new Producer(kafkaClient);

// MongoDB connection URL
const mongoUrl = 'mongodb://localhost:27017';

// Function to send data to Kafka
const sendToKafka = (kafkaTopic, payloads) => {
  producer.send(payloads, (err, data) => {
    if (err) {
      console.error('Error sending data to Kafka:', err);
    } else {
      console.log('Messages sent to Kafka:', payloads.length);
    }
  });
};

// Function to fetch data from MongoDB and send it to Kafka
const fetchDataAndSendToKafka = async (kafkaTopic) => {
  try {
    const data = await fetchMongoData();
    if (data && data.length > 0) {
      // Prepare payloads
      const payloads = data.map((item, index) => ({
        topic: kafkaTopic,
        messages: JSON.stringify(item),
        key: String(index),
      }));

      // Send data to Kafka
      sendToKafka(kafkaTopic, payloads);
    } else {
      console.warn('No data found in MongoDB.');
    }
  } catch (error) {
    console.error('Error fetching or sending data:', error);
  }
};

// Kafka producer ready event
producer.on('ready', () => {
  console.log('Kafka producer is ready.');

  // Fetch data from MongoDB and send it to Kafka at regular intervals
  const kafkaTopic = 'myTopic'; // Define the Kafka topic here
  setInterval(() => {
    fetchDataAndSendToKafka(kafkaTopic); // Pass the Kafka topic as a parameter
  }, 5000); // Adjust the interval as needed
});

// Handle Kafka producer errors
producer.on('error', (err) => {
  console.error('Kafka producer error:', err);
});

// Close the Kafka producer when the application exits
process.on('SIGINT', () => {
  producer.close(() => {
    console.log('Kafka producer has been closed.');
    process.exit();
  });
});
