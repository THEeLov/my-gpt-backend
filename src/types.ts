import { Result } from "@badrap/result";

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
}

export type DbResult<T> = Promise<Result<T>>;