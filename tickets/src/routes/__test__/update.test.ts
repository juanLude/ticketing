import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); // Generate a new ObjectId

  await request(app)
    .put(`/api/tickets/${id}`) // Invalid ID format
    .set("Cookie", global.signin())
    .send({
      title: "asdasd",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); // Generate a new ObjectId

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "asdasd",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "asdasd",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`) // Invalid ID format
    .set("Cookie", global.signin()) // Different user
    .send({
      title: "asdasd",
      price: 1000,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.signin(); // Simulate a signed-in user
  const response = await request(app) // Create a new ticket
    .post("/api/tickets")
    .set("Cookie", cookie) // Set the cookie to simulate a signed-in user
    .send({
      title: "asdasd",
      price: 20,
    });

  await request(app) // Update the ticket with invalid title
    .put(`/api/tickets/${response.body.id}`) // Invalid ID format
    .set("Cookie", cookie) // Set the cookie to simulate a signed-in user
    .send({
      title: "", // Invalid title
      price: 20,
    })
    .expect(400);

  await request(app) // Update the ticket with invalid price
    .put(`/api/tickets/${response.body.id}`) // Invalid ID format
    .set("Cookie", cookie)
    .send({
      title: "asdasd",
      price: -10, // Invalid price
    })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets") // Create a new ticket
    .set("Cookie", cookie)
    .send({
      title: "asdasd",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`) // Update the ticket
    .set("Cookie", cookie) // Set the cookie to simulate a signed-in user
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200); // Expect a 200 OK response

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`) // Get the ticket ID
    .send()
    .expect(200); // Expect a 200 OK response

  expect(ticketResponse.body.title).toEqual("new title"); // Check if the title matches
  expect(ticketResponse.body.price).toEqual(100); // Check if the price matches
});

it("publishes an event", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post("/api/tickets") // Create a new ticket
    .set("Cookie", cookie)
    .send({
      title: "asdasd",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`) // Update the ticket
    .set("Cookie", cookie) // Set the cookie to simulate a signed-in user
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200); // Expect a 200 OK response

  expect(natsWrapper.client.publish).toHaveBeenCalled(); // Check if the publish method was called
});
