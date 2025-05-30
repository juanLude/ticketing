import { Message } from "node-nats-streaming";
import {
  Listener,
  TicketUpdatedEvent,
  Subjects,
} from "@juanludetickets/common";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }
    const { title, price } = data;
    // Update the ticket with the new data
    ticket.set({ title, price });
    await ticket.save();
    // Acknowledge the message
    msg.ack();
  }
}
