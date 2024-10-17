import { Result } from "@badrap/result";
import { Conversation, DbResult } from "../types";
import prisma from "../client";

/**
 * Creates a new conversation with an initial message and two participants: the user and the chatbot.
 *
 * @param {string} message - The message content sent by the user.
 * @param {string} userId - The ID of the user who initiates the conversation.
 * @returns {Promise<DbResult<Conversation>>} A promise that resolves to a `DbResult` object containing
 * either the successfully created conversation or an error.
 *
 */
export const createConversation = async (
  message: string,
  userId: string
): Promise<DbResult<Conversation>> => {
  try {
    const newConversation = await prisma.conversation.create({
      data: {
        name: message,
        participants: {
          connect: [{ id: userId }, { id: process.env.CHATBOT_ID }],
        },
        messages: {
          create: {
            message,
            user: {
              connect: { id: userId },
            },
          },
        },
      },
    });

    return Result.ok(newConversation);
  } catch (error) {
    return Result.err(new Error());
  }
};
