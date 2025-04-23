import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";

const createTicket = () => {
  return request(app)
    .post("/api/tickets") // Create a new ticket
    .set("Cookie", global.signin()) // Set the cookie to simulate a signed-in user
    .send({
      title: "valid title",
      price: 20,
    });
};

it("can fetch a list of tickets", async () => {
  await createTicket(); // Create three tickets
  await createTicket();
  await createTicket();

  const response = await request(app)
    .get("/api/tickets") // Get the list of tickets
    .send()
    .expect(200); // Expect a 200 OK response

  expect(response.body.length).toEqual(3); // Expect the response to have 3 tickets
});
