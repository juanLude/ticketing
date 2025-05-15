import nats, { Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";

class NatsWrapper {
  private _client?: Stan; // ? might be undefined for a while

  get client() {
    // getter to access the private _client property
    // If _client is not defined, throw an error
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }
    return this._client;
  }
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    // Return a promise that resolves when the client is connected
    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        console.error("Error connecting to NATS", err);
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
