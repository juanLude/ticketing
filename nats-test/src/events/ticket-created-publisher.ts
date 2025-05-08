import { Publisher } from "./base-publisher";
import { TicketCreatedEvent } from "./ticket-created-event"; // Import the TicketCreatedEvent interface
import { Subjects } from "./subjects"; // Import the Subjects enum

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
