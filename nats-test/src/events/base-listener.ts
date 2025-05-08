import { Stan, Message } from "node-nats-streaming";
import { Subjects } from "./subjects"; // Import the Subjects enum
interface Event {
  subject: Subjects; // The subject of the event
  data: any; // The data associated with the event
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"]; // The subject of the event
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void; // Abstract method to handle incoming messages
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
