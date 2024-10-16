import { DbResult, User } from "../types";
import { Result } from "@badrap/result";
import prisma from "../client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  EmailAlreadyExists,
  InvalidCredentials,
} from "../errors/databaseErrors";
import bcrypt from "bcryptjs";

export const findUserSignIn = async (
  email: string,
  password: string
): Promise<DbResult<User>> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const isMatch = await bcrypt.compare(password, user?.password || "");

    if (!user || !isMatch) {
      return Result.err(new InvalidCredentials());
    }

    return Result.ok(user);
  } catch (error) {
    return Result.err(new Error());
  }
};

export const createUser = async (
  username: string,
  email: string,
  password: string
): Promise<DbResult<User>> => {
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    return Result.ok(newUser);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return Result.err(new EmailAlreadyExists());
      }
    }

    return Result.err(new Error());
  }
};
