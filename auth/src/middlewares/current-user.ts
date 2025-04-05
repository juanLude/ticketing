import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next(); // No JWT present, so just call next middleware
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload; // Attach the payload to the request object
    next(); // authenticated user, call next middleware
  } catch (err) {
    return res.status(401).send({ message: "Invalid or expired token" });
  }

  next(); // If everything goes well, move on to the next middleware
};
