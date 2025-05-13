import exress, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@juanludetickets/common";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@juanludetickets/common";
import { NotAuthorizedError } from "@juanludetickets/common";
import { TicketCreatedPublisher } from "../../events/publishers/ticket-created-publisher";
import { TicketUpdatedPublisher } from "../../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = exress.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, price } = req.body;

    const ticket = await Ticket.findById(id);
    // Check if the ticket exists
    if (!ticket) {
      throw new NotFoundError();
    }
    // Check if the ticket belongs to the user
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    // Update the ticket with the new values
    ticket.set({
      title,
      price,
    });
    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.send(ticket);
  }
);

export { router as updateTicketRouter };
