import { Result } from "@badrap/result";
import prisma from "../client";
import { DbResult, Message } from "../types";
import { Conversation } from "@prisma/client";

/**
 * Creates a new message in a specified conversation.
 *
 * @param {string} conversationId - The ID of the conversation where the message will be added.
 * @param {string} message - The content of the message to be created.
 * @param {string} userId - The ID of the user sending the message.
 * @returns {Promise<DbResult<Conversation>>} A promise that resolves to a `DbResult` containing either:
 * - The conversation where message was created
 * - An error if the operation fails.
 *
 */
export const createMessage = async (
  conversationId: string,
  message: string,
  userId: string
): Promise<DbResult<Conversation>> => {
  try {
    const newMessage = await prisma.message.create({
      data: {
        message,
        user: {
          connect: { id: userId },
        },
        conversation: {
          connect: { id: conversationId },
        },
      },
      include: {
        conversation: true
      }
    });

    return Result.ok(newMessage.conversation!);
  } catch (error) {
    return Result.err(new Error());
  }
};
