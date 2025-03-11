import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { CustomError } from "../errors/custom-errors";

// Error-handling middleware function
export const errorHandler: ErrorRequestHandler = (
  err: Error, // The error object thrown from a route or middleware
  req: Request, // The request object
  res: Response, // The response object
  next: NextFunction // The next middleware function
): void => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // Send a 400 Bad Request response with the error message
  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
