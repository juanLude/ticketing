import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../../models/ticket";
import { Order, OrderStatus } from "../../../models/order";
import mongoose from "mongoose";

it("marks an order as cancelled", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();
  // Make a request to build an order with this ticket
  const user = global.signin();
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);
  // Make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204); // Expect a 204 No Content response

  // Make a request to fetch the order to see if it was cancelled
  const updateOrder = await Order.findById(order.id);

  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it.todo("emits an order cancelled event");
