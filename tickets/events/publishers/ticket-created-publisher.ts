import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@juanludetickets/common";
import { natsWrapper } from "../../src/nats-wrapper";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

// new TicketCreatedPublisher(natsWrapper.client).publish({
//   id: "123",
//   title: "concert",
//   price: 20,
//   userId: "123",
// });
