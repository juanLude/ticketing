import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@juanludetickets/common";

const app = express();
app.set("trust proxy", true); // Trust traffic as secure even though it is coming from a proxy. Traffic is coming from Ingress Nginx, which is a proxy.
app.use(json());
app.use(
  cookieSession({
    signed: false, // Disable encryption because JWT is already encrypted
    secure: true, // Only use cookies over HTTPS
  })
);

require("express-async-errors");

app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
