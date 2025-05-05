import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
//
// This is a simple NATS streaming client that listens for messages on the "ticket:created" channel.
// It connects to a NATS server, subscribes to the channel, and logs the received messages to the console.
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  // Handle NATS connection close event to gracefully exit the process
  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable() // This option is used to deliver all available messages from the stream.
    .setDurableName("accounting-service"); // This option is used to create a durable subscription, which allows the subscriber to receive messages even if it is not connected at the time the messages are published.
  const subscription = stan.subscribe(
    "ticket:created",
    "queue-group-name",
    options
  );
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    // Check if data is a Buffer and convert it to string if necessary
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()} with data: ${data}`);
    }
    msg.ack(); // Manually acknowledge the message
  });
  console.log("Listening for messages on ticket:created");
});

process.on("SIGINT", () => stan.close()); // Close NATS connection on SIGINT. This is typically sent when the user presses Ctrl+C in the terminal.
process.on("SIGTERM", () => stan.close()); // Close NATS connection on SIGTERM. This is typically sent when the process is terminated by a signal from the operating system.

abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void; // Abstract method to handle incoming messages
  private client: Stan;
  protected ackWait = 5 * 1000; // Acknowledge wait time in milliseconds
  protected ackTimeout: NodeJS.Timeout | null = null; // Timeout for acknowledgment

  constructor(client: Stan) {
    this.client = client;
  }
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setAckWait(this.ackWait) // This option is used to set the acknowledgment wait time for the subscription.
      .setDeliverAllAvailable() // This option is used to deliver all available messages from the stream.
      .setDurableName(this.queueGroupName); // To create a durable subscription, which allows the subscriber to receive messages even if it is not connected at the time the messages are published.
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg); // Parse the message data
      this.onMessage(parsedData, msg); // Call the onMessage method with the parsed data and message
    });
  }
  parseMessage(msg: Message) {
    // This method is used to parse the message data from the NATS message.
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data) // If data is a string, parse it as JSON
      : JSON.parse(data.toString("utf8")); // Convert Buffer to string and parse as JSON
  }
}
