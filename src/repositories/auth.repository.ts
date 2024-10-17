import { DbResult, User } from "../types";
import { Result } from "@badrap/result";
import prisma from "../client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  EmailAlreadyExists,
  InvalidCredentials,
} from "../errors/databaseErrors";
import bcrypt from "bcryptjs";

/**
 * Finds a user by their email and checks if the provided password matches the stored hashed password.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The plain text password provided by the user for authentication.
 * @returns {Promise<DbResult<User>>} A promise that resolves to a `DbResult` containing either:
 * - The user object if credentials are valid.
 * - An `InvalidCredentials` error if the credentials are invalid.
 *
 */
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

/**
 * Creates a new user with the given username, email, and password.
 *
 * @param {string} username - The username for the new user.
 * @param {string} email - The email address for the new user.
 * @param {string} password - The password for the new user (should be hashed before being passed).
 * @returns {Promise<DbResult<User>>} A promise that resolves to a `DbResult` containing either:
 * - The newly created user object.
 * - An `EmailAlreadyExists` error if the email is already registered.
 *
 */
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
