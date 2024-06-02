import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { user } from "@prisma/client";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: user;
    }
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Extract the token from the header
  const token = req.headers.authorization?.split(' ')[1]; // Assuming "Bearer <token>"

  // 2. If token is not present, throw an error of unauthorized
  if (!token) {
    return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
  }
  try {
    // 3. If the token is present, verify that token and extract the payload
    const payload = jwt.verify(token, JWT_SECRET) as any;
    // 4. Get the user from the payload
    const user = await prismaClient.user.findFirst({
      where: { userID: payload.userID }
    });

    if (!user) {
      return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    }

    // 5. Attach the user to the current request object
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;
