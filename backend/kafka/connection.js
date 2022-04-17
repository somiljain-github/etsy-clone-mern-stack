import kafka from "kafka-node";
const dotenv = require("dotenv");

dotenv.config();

KAFKA_IP = process.env.KAFKA_IP;

export class ConnectionProvider {
  constructor() {
    this.getConsumer = (topicName) => {
      this.client = new kafka.KafkaClient(`${KAFKA_IP}:9092`);

      this.kafkaConsumerConnection = new kafka.Consumer(this.client, [
        { topic: topicName, partition: 0 },
      ]);

      this.client.on("ready", () => {
        console.log("Client ready!");
      });

      return this.kafkaConsumerConnection;
    };

    this.getProducer = () => {
      this.client = new kafka.KafkaClient(`${KAFKA_IP}:9092`);
      this.kafkaProducerConnection = new kafka.HighLevelProducer(this.client);
      this.client.on("ready", () => {
        console.log("Producer ready!");
      });

      return this.kafkaProducerConnection;
    };
  }
}
