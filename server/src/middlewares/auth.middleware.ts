import type { Request, Response, NextFunction } from "express";
import { readPayload, type JWTPayload } from "../utils/jwt.js";

// Extend Express's Request interface to include our user payload
declare global {
  namespace Express {
    export interface Request {
      user?: JWTPayload;
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Throw a new error with a status code in the 'cause' property
      throw new Error("Unauthorized: No token provided", {
        cause: { status: 401 },
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized: Malformed token", {
        cause: { status: 401 },
      });
    }

    const payload = readPayload(token);
    req.user = payload; // Attach user payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Catch any error (our custom ones or from jwt.verify)
    // and pass it to the central errorHandler.
    next(error);
  }
};

export const identifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const payload = readPayload(token);
        req.user = payload; // Attach user payload if token is valid
      }
    }
  } catch (error) {
    // If the token is present but invalid (expired, etc.), we ignore it
    // and treat the user as a guest. We don't throw an error here.
  }

  next();
};
