import { Subjects } from "./subjects";

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
// This interface defines the structure of the TicketCreated event,
// including the subject and data properties.
// The subject property is of type Subjects.TicketCreated,
// and the data property contains the id, title, and price of the ticket.
