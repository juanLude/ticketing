import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
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

it("returns an error if the ticket is already reserved", async () => {});

it("reserves a ticket", async () => {});
