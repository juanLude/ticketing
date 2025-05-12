import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { randomBytes } from "crypto";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await natsWrapper.connect(
      "ticketing",
      randomBytes(4).toString("hex"),
      "http://nats-srv:4222"
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit(); // Exit the process when the NATS connection is closed
    });
    process.on("SIGINT", () => natsWrapper.client.close()); // Close the client on SIGINT
    process.on("SIGTERM", () => natsWrapper.client.close()); // Close the client on SIGTERM

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();
