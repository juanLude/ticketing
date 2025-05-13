import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

jest.mock("../nats-wrapper"); // Mock the NATS wrapper to prevent actual NATS calls
// This file is used to set up the test environment for the auth service.
// It uses an in-memory MongoDB server to run tests without needing a real database.
let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const db = mongoose.connection.db;
  if (db) {
    const collections = await db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  await mongo.stop(); // Stop the MongoDB server
  await mongoose.connection.close(); // Close the connection to MongoDB
});
