import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@juanludetickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;

  // No additional methods or properties are needed for this publisher
  // as it inherits everything from the base Publisher class.
}
