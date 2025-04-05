import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import cookieSession from "cookie-session";

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

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
// app.all("*", async (req, res) => {
//   throw new NotFoundError();
// });
app.use(errorHandler);

export { app };
