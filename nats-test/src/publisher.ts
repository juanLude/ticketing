import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
// Our streaming server is running inside our kubernetes cluster,
// so we need to connect to it using the service name and port
// Create a NATS client instance and connect to the NATS server
const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan); // Create a new instance of TicketCreatedPublisher
  try {
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
      userId: "123",
    }); // Publish a message to the NATS server
  } catch (err) {
    console.error("Error publishing event", err);
    // Handle the error as needed
    // For example, you could log it or send an alert
    // You could also retry the publish operation if necessary
    // Or you could implement a backoff strategy for retries
    // Or you could send the event to a dead-letter queue for later processing
    // Or you could notify the user about the error
    // Or you could do nothing and let the application continue running
  }
  // Send a message to the NATS server
  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 20,
  // });

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event published");
  // });
});
