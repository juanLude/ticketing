import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@juanludetickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
