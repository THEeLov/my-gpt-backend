import { Request, Response } from "express";
import { getConversationsOfUser } from "../repositories/conversations.repository";
import { ConversationWithMessages } from "../types";

export const getConversations = async (
  req: Request,
  res: Response
): Promise<Response> => {

  const userId = req.params.userId;

  const result = await getConversationsOfUser(userId);

  if (result.isOk) {
    return res.status(200).json(result.value);
  }

  return res.status(500).json({error: "Internal server error"});
};

export const getConversationAllMessages = (req: Request, res: Response): Promise<ConversationWithMessages> => {

  const conversationId = req.params.conversationId;

  
}
