import {
  OrderCancelledEvent,
  Subjects,
  Publisher,
} from "@juanludetickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  // No additional methods or properties are needed for this publisher
  // as it inherits everything from the base Publisher class.
}
