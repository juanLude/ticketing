import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@juanludetickets/common";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

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
    validateRequest, // Validate the request body. If validation fails, it will throw a BadRequestError.
  ],
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as newOrderRouter };
