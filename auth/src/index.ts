import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import cookieSession from "cookie-session";

import mongoose from "mongoose";

const app = express();
app.set("trust proxy", true); // Trust traffic as secure even though it is coming from a proxy
app.use(json());
app.use(
  cookieSession({
    signed: false,  // Disable encryption
    secure: true // Only use cookies over HTTPS
));

require("express-async-errors");

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
// app.all("*", async (req, res) => {
//   throw new NotFoundError();
// });
app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
};

start();
