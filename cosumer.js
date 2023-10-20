const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

// Define the topic to consume messages from
const kafkaTopic = 'myTopic';

// Create a Kafka consumer
const consumer = new Consumer(client, [{ topic: kafkaTopic, partition: 0 }]);

consumer.on('message', (message) => {
  try {
    // Display the received message in the console
    console.log('Received message from Kafka:', message.value);
  } catch (exception) {
    console.error('Error processing message:', exception);
  }
});

consumer.on('error', (err) => {
  console.error('Kafka consumer error:', err);
});
