import { Result } from "@badrap/result";
import { Conversation, ConversationWithMessages, DbResult } from "../types";
import prisma from "../client";
import { NoConversationFound } from "../errors/databaseErrors";

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

/**
 * Retrieves all conversations for a specified user.
 *
 * @param {string} userId - The ID of the user for whom to retrieve conversations.
 * @returns {Promise<DbResult<Conversation[]>>} A promise that resolves to a `DbResult` containing:
 * - An array of `Conversation` objects if successful.
 * - An error if the operation fails.
 *
 */
export const getConversationsOfUser = async (
  userId: string
): Promise<DbResult<Conversation[]>> => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
    });

    return Result.ok(conversations);
  } catch (error) {
    return Result.err(new Error());
  }
};

/**
 * Retrieves a conversation along with its associated messages and user information for each message.
 *
 * @param {string} conversationId - The ID of the conversation to retrieve.
 * @returns {Promise<DbResult<ConversationWithMessages>>} A promise that resolves to a `DbResult` containing:
 * - The `ConversationWithMessages` object if successful, which includes the conversation details and its messages.
 * - An error if the operation fails or if the conversation does not exist.
 *
 */
export const getConversationMessages = async (
  conversationId: string
): Promise<DbResult<ConversationWithMessages>> => {
  try {
    const conversationsWithMessages = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            user: true,
          },
        },
      },
    });

    if (conversationsWithMessages === null) {
      return Result.err(new NoConversationFound());
    }

    return Result.ok(conversationsWithMessages);
  } catch (error) {
    return Result.err(new Error());
  }
};
