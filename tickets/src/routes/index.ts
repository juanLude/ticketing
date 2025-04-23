import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const tickets = await Ticket.find({}); // Fetch all tickets from the database
  res.send(tickets); // Return the list of tickets
});

export { router as indexTicketRouter };
