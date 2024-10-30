import { Request, Response } from "express";
import { createConversation } from "../repositories/conversations.repository";
import {
  createMessage,
  getChatResponseMessage,
} from "../repositories/messages.repository";

export const postMessage = async (
  req: any,
  res: Response
): Promise<Response> => {
  const conversationId = req.params.conversationId;
  const { message } = req.body;

  // Create or add user message to the conversation, then add chat gpt response
  const result =
    conversationId === undefined
      ? await createConversation(message, req.user.id)
      : await createMessage(conversationId, message, req.user.id);

  if (result.isOk) {
    // Now add response to the conversation
    const newResult = await getChatResponseMessage(message, result.value.id);

    if (newResult.isOk) {
      return res.status(200).json(newResult.value);
    }

    return res
      .status(500)
      .json({ error: "Interanl server error - chat response" });
  }
  return res.status(500).json({ error: "Internal server error - new message" });
};
