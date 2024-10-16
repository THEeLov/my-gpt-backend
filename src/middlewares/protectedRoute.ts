import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../client";

export const protectedRoute = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "You are not authorized - No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decode) {
      return res
        .status(401)
        .json({ error: "You are not authorized - Invalid token" });
    }

    const userId = (decode as JwtPayload).userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error - token validation" });
  }
};
