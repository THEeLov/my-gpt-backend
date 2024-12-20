import { Result } from "@badrap/result";
import { Conversation, ConversationWithMessages, DbResult } from "../types";
import prisma from "../client";
import { NoConversationFound, PermissionError } from "../errors/databaseErrors";
import OpenAI from "openai";
const openai = new OpenAI();

/**
 * Creates a new conversation with a headline that AI created and two participants: the user and the chatbot.
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

    // Get a headline from AI
    const completion = await openai.chat.completions.create(
      {
        model: "gpt-4o",
        messages: [
          {
          "role": "user",
          "content": `Create a headline from this question user posted (make it as short as possible, just some keywords): ${message}`
          }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const newConversation = await prisma.conversation.create({
      data: {
        name: `${completion.choices[0].message.content}`,
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
      orderBy: {
        createdAt: "desc",
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
  conversationId: string,
  userId: string
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
          orderBy: {
            createdAt: "asc"
          }
        },
        participants: true,
      },
    });

    if (conversationsWithMessages === null) {
      return Result.err(new NoConversationFound());
    }

    const isUserParticipant = conversationsWithMessages.participants.some(
      (participant) => participant.id === userId
    );

    if (!isUserParticipant) {
      return Result.err(new PermissionError());
    }

    return Result.ok(conversationsWithMessages);
  } catch (error) {
    return Result.err(new Error());
  }
};

/**
 * Retrieves the conversation history for a given conversation ID.
 *
 * This function queries the database to find a unique conversation by its ID.
 * It includes the related messages, each with its associated user details.
 * The messages are ordered by their creation date in ascending order,
 * and only the first 10 messages are retrieved.
 *
 * @param {string} conversationId - The unique identifier of the conversation to retrieve.
 * @returns {Promise<DbResult<ConversationWithMessages>>} A promise that resolves to a DbResult containing
 * either the conversation with its messages or an error if the conversation is not found.
 *
 * @throws Will return an error result if any database error occurs or if the conversation is not found.
 */
export const getConversationHistory = async (
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
          orderBy: {
            createdAt: "asc",
          },
          take: 10,
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
