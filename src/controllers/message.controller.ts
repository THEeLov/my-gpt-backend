import { Request, Response } from "express"

export const postMessage = async (req: Request, res: Response): Promise<Response> => {

  const id = req.params.id;
  const { message, userId } = req.body;
  let result;

  // No selected chat so we create new one
  if (id === undefined) {
    result = await createConversation(message, userId);
  }

  else {


  }
}