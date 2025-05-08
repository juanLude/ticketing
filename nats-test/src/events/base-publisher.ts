import { TicketCreatedEvent } from "./ticket-created-event";
import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects"; // Import the Subjects enum

interface Event {
  subject: Subjects; // The subject of the event
  data: any; // The data associated with the event
}
export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]) {
    this.client.publish(this.subject, data, () => {
      console.log(`Event published: ${this.subject}`);
    });
  }
}
