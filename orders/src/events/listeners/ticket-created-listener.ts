import { Message } from "node-nats-streaming";
import {
  Listener,
  TicketCreatedEvent,
  Subjects,
} from "@juanludetickets/common";
import { Ticket } from "../../../models/ticket";
import { queueGroupName } from "./queue-group-name";
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    // Create a new ticket in the database
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    // Acknowledge the message
    msg.ack();
  }
}
