const kafka = require('kafka-node');
const readline = require('readline');

// Kafka broker(s) configuration
const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new kafka.Producer(kafkaClient);

// Kafka topic to send data to
const kafkaTopic = 'myTopic';

// Create a readline interface to capture console input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to Kafka
producer.on('ready', () => {
  console.log('Kafka producer is ready.');

  // Function to send a message to Kafka
  const sendMessage = (input) => {
    const payloads = [
      {
        topic: kafkaTopic,
        messages: input
      }
    ];

    producer.send(payloads, (err, data) => {
      if (err) {
        console.error('Error sending data to Kafka:', err);
      } else {
        console.log('Message sent to Kafka:', input);
      }
    });
  };

  // Capture console messages and send them to Kafka every 5 seconds (adjust as needed)
  const interval = 5000; // 5 seconds
  rl.on('line', (input) => {
    sendMessage(input);
  });

  // Set up the interval for sending messages
  setInterval(() => {
    sendMessage('This is a periodic message sent to Kafka.');
  }, interval);
});

// Handle errors
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
