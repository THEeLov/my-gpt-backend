import { Request, Response } from "express";

// Promse<any> should be changed but typescript problems
export const signInUser = async (req: Request, res: Response): Promise<any> => {
  
  return res.status(200).json({message: "Hello my friend"});
}

export const signUpUser = async (req: Request, res: Response): Promise<any> => {

  return res.status(404).json({message: "Nope not working"})
}