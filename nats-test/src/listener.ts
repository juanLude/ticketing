import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
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

  const options = stan.subscriptionOptions().setManualAckMode(true); // Set manual acknowledgment mode
  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );
  subscription.on("message", (msg: Message) => {
    const data = msg.getData();
    // Check if data is a Buffer and convert it to string if necessary
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()} with data: ${data}`);
    }
    msg.ack(); // Manually acknowledge the message
  });
  console.log("Listening for messages on ticket:created");
});

process.on("SIGINT", () => stan.close()); // Close NATS connection on SIGINT. This is typically sent when the user presses Ctrl+C in the terminal.
process.on("SIGTERM", () => stan.close()); // Close NATS connection on SIGTERM. This is typically sent when the process is terminated by a signal from the operating system.
