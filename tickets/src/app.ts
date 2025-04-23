import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@juanludetickets/common";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index";

const app = express();
app.set("trust proxy", true); // Trust traffic as secure even though it is coming from a proxy. Traffic is coming from Ingress Nginx, which is a proxy.
app.use(json());
app.use(
  cookieSession({
    signed: false, // Disable encryption because JWT is already encrypted
    secure: true, // Only use cookies over HTTPS
  })
);

app.use(currentUser); // Middleware to check if the user is signed in

require("express-async-errors");

app.use(createTicketRouter); // Route to create a new ticket
app.use(showTicketRouter); // Route to show a ticket
app.use(indexTicketRouter); // Route to list all tickets
app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
