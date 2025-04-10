"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const body_parser_1 = require("body-parser");
const current_user_1 = require("./routes/current-user");
const signin_1 = require("./routes/signin");
const signout_1 = require("./routes/signout");
const signup_1 = require("./routes/signup");
const error_handler_1 = require("@juanludetickets/common");
const cookie_session_1 = __importDefault(require("cookie-session"));
const app = (0, express_1.default)();
exports.app = app;
app.set("trust proxy", true); // Trust traffic as secure even though it is coming from a proxy. Traffic is coming from Ingress Nginx, which is a proxy.
app.use((0, body_parser_1.json)());
app.use(
  (0, cookie_session_1.default)({
    signed: false, // Disable encryption because JWT is already encrypted
    secure: true, // Only use cookies over HTTPS
  })
);
require("express-async-errors");
app.use(current_user_1.currentUserRouter);
app.use(signin_1.signinRouter);
app.use(signout_1.signoutRouter);
app.use(signup_1.signupRouter);
// app.all("*", async (req, res) => {
//   throw new NotFoundError();
// });
app.use(error_handler_1.errorHandler);
