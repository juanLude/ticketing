import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";

// Error-handling middleware function
export const errorHandler = (
  err: Error, // The error object thrown from a route or middleware
  req: Request, // The request object
  res: Response, // The response object
  next: NextFunction // The next middleware function
) => {
  if (err instanceof RequestValidationError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(err.statutsCode).send({ errors: err.serializeErrors() });
  }
  // Send a 400 Bad Request response with the error message
  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
