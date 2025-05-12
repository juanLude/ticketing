import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener"; // Import the base listener class
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    // This method is called when a message is received.
    console.log("Event data!", data);
    console.log(data.id); // Log the ticket ID
    console.log(data.title); // Log the ticket title
    console.log(data.price); // Log the ticket price
    console.log(data.userId); // Log the user ID
    msg.ack(); // Manually acknowledge the message
  }
}
