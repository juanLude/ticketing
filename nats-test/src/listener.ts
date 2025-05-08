import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";
//
// This is a simple NATS streaming client that listens for messages on the "ticket:created" channel.
// It connects to a NATS server, subscribes to the channel, and logs the received messages to the console.
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  // Handle NATS connection close event to gracefully exit the process
  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  new TicketCreatedListener(stan).listen(); // Create a new instance of TicketCreatedListener and start listening for messages
});

process.on("SIGINT", () => stan.close()); // Close NATS connection on SIGINT. This is typically sent when the user presses Ctrl+C in the terminal.
process.on("SIGTERM", () => stan.close()); // Close NATS connection on SIGTERM. This is typically sent when the process is terminated by a signal from the operating system.
