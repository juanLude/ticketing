import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@juanludetickets/common"; // Importing NotFoundError for error handling

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id); // Find the ticket by ID

  if (!ticket) {
    throw new NotFoundError(); // If not found, throw a NotFoundError
  }

  res.send(ticket); // If found, return the ticket
});

export { router as showTicketRouter };
