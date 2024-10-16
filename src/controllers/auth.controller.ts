import { Request, Response } from "express";
import { createUser, findUserSignIn } from "../repositories/auth.repository";
import bcrypt from "bcryptjs";
import {
  EmailAlreadyExists,
  InvalidCredentials,
} from "../errors/databaseErrors";
import { generateToken } from "../utils/generateToken";

export const signInUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await findUserSignIn(email, password);

  if (result.isOk) {
    const token = generateToken(result.value.id);
    return res.status(200).json({ authToken: token, data: result.value });
  }

  const error = result.error;

  if (error instanceof InvalidCredentials) {
    return res.status(401).json({ error: "Invalid Credentials" });
  }

  return res.status(500).json({ error: "Internal server error" });
};

export const signUpUser = async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Password do not match" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await createUser(username, email, hashedPassword);

  if (result.isOk) {
    const token = generateToken(result.value.id);
    return res.status(201).json({ authToken: token, data: result.value });
  }

  const error = result.error;

  if (error instanceof EmailAlreadyExists) {
    return res.status(409).json({ error: "Email is already used" });
  }

  return res.status(500).json({ error: "Internal server error" });
};
