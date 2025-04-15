import request from "supertest";
import { app } from "../../app";

it("returns a 404 if the ticket is not found", async () => {
  const response = await request(app)
    .get("/api/tickets/12345678901234567890123456789012") // Invalid ticket ID
    .send()
    .expect(404); // Expect a 404 Not Found error
});

it("returns the ticket if the ticket is found", async () => {
  const response = await request(app)
    .get("/api/tickets") // Valid ticket ID
    .set("Cookie", global.signin()) // Set the cookie to simulate a signed-in user
    .send({
      title: "valid title",
      price: 20,
    })
    .expect(201); // Expect a 201 Created response

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`) // Get the ticket by ID
    .send()
    .expect(200); // Expect a 200 OK response

  expect(ticketResponse.body.title).toEqual("valid title"); // Check if the title matches
  expect(ticketResponse.body.price).toEqual(20); // Check if the price matches
});
