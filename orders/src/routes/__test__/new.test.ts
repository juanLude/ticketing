import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../../models/ticket";
import { Order, OrderStatus } from "../../../models/order";
console.log("🔥 Test file loaded");
it("returns an error if the ticket is not found", async () => {
  console.log("ENV:", process.env.NODE_ENV);
  const ticketId = new mongoose.Types.ObjectId().toHexString(); // Generate a new ObjectId
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId, quantity: 1 })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString(); // Generate a new ObjectId
  // Create an order with the ticketId
  const ticket = Ticket.build({
    id: ticketId,
    title: "concert",
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    userId: "123",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString(); // Generate a new ObjectId
  const ticket = Ticket.build({
    id: ticketId,
    title: "concert",
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(201);
});
