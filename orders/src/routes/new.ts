import express, { Request, Response } from "express";
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  OrderStatus,
  BadRequestError,
} from "@juanludetickets/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60; // 15 minutes

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // Check if ticketId is a valid MongoDB ObjectId
      .withMessage("TicketId is required"),
    body("quantity")
      .isFloat({ gt: 0 }) // Check if quantity is a float greater than 0
      .withMessage("Quantity must be greater than 0"),
  ],
  validateRequest, // Validate the request body. If validation fails, it will throw a BadRequestError.
  async (req: Request, res: Response) => {
    // Find the ticket that the user is trying to order in the database
    const { ticketId, quantity } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }
    // Check if the ticket is already reserved
    // This method checks if there is an existing order for this ticket that is not completed
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // Calculate the expiration date for this order
    const expiration = new Date();
    // Set the expiration date to 15 minutes from now
    // This is done by adding 15 minutes (15 * 60 seconds) to the current date
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket, // This is the ticket document we found earlier
    });
    // Save the order to the database
    // The save method is asynchronous, so we use await to wait for it to complete
    await order.save();
    // Publish an event to notify other services about the order creation
    res.send({});
  }
);

export { router as newOrderRouter };
