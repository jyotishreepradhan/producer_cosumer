const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const KafkaClient = kafka.KafkaClient;

// Kafka broker configuration
const kafkaClient = new KafkaClient({ kafkaHost: 'localhost:9092' });

// Kafka topic to consume data from
const kafkaTopic = 'myTopic';

// Create a Kafka consumer
const consumer = new Consumer(kafkaClient, [{ topic: kafkaTopic, partition: 0 }]);

consumer.on('message', (message) => {
  try {
    // Display the received message in the console
    console.log('Received message from Kafka:', message.value);
    
    // Process the message as needed
    // You can insert it into MongoDB or perform any other operation here
  } catch (exception) {
    console.error('Error processing message:', exception);
  }
});

consumer.on('error', (err) => {
  console.error('Kafka consumer error:', err);
});
