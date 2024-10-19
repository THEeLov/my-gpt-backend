import { Request, Response } from "express";
import {
  getConversationMessages,
  getConversationsOfUser,
} from "../repositories/conversations.repository";
import { NoConversationFound, PermissionError } from "../errors/databaseErrors";

export const getConversations = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userId = req.params.userId;

  const result = await getConversationsOfUser(userId);

  if (result.isOk) {
    return res.status(200).json(result.value);
  }

  return res.status(500).json({ error: "Internal server error" });
};

export const getConversationAllMessages = async (
  req: any,
  res: Response
): Promise<Response> => {
  const conversationId = req.params.conversationId;

  const result = await getConversationMessages(conversationId, req.user.id);

  if (result.isOk) {
    return res.status(200).json(result.value);
  }

  const error = result.error;

  if (error instanceof NoConversationFound) {
    return res.status(404).json({ error: "No conversation was found" });
  }

  if (error instanceof PermissionError) {
    return res
      .status(401)
      .json({ error: "You are not authorized to get this converstion" });
  }

  return res.status(500).json({ error: "Internal server error" });
};
