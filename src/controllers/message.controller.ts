import { Request, Response } from "express";
import { createConversation } from "../repositories/conversations.repository";
import { createMessage } from "../repositories/messages.repository";

export const postMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const conversationId = req.params.id;
  const { message, userId } = req.body;

  const result =
    conversationId === undefined
      ? await createConversation(message, userId)
      : await createMessage(conversationId, message, userId);

  if (result.isOk) {
    return res.status(200).json(result.value);
  }

  return res.status(500).json({ error: "Internal server error - new message" });
};
