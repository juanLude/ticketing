import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@juanludetickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../../events/publishers/ticket-created.publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

// Route to create a new ticket. It is protected by the requireAuth middleware, which checks if the user is signed in.
// The route handler responds with a 200 status code if the user is authenticated. if not, it will throw a NotAuthorizedError.
// The request body is expected to contain a title and price, which are validated in the route handler.
router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 }) // Check if price is a float greater than 0
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body; // Destructure title and price from the request body
    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id }); // Create a new Ticket instance
    await ticket.save(); // Save the ticket to the database
    // Publish an event to notify other services about the ticket creation
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.status(201).send(ticket); // Respond with a 201 status code and the created ticket
  }
);

export { router as createTicketRouter };
