import { Result } from "@badrap/result";
import prisma from "../client";
import { ChatMessage, DbResult, Message } from "../types";
import { Conversation } from "@prisma/client";
import OpenAI from "openai";
import { getConversationHistory } from "./conversations.repository";
const openai = new OpenAI();

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
        conversation: true,
      },
    });

    return Result.ok(newMessage.conversation!);
  } catch (error) {
    return Result.err(new Error());
  }
};

/**
 * Retrieves a chat response message based on user input and conversation history.
 *
 * @param {string} message - The user's input message that will be sent to the AI model.
 * @param {string} conversationId - The unique identifier for the conversation.
 * @returns {Promise<DbResult<Conversation>>} - A promise that resolves to the result of the conversation,
 *                                                which includes the newly created message and the updated conversation history.
 */
export const getChatResponseMessage = async (
  message: string,
  conversationId: string
): Promise<DbResult<Conversation>> => {
  try {
    const conversationHistory = await getConversationHistory(conversationId);

    if (conversationHistory.isErr) {
      return Result.err(conversationHistory.error);
    }

    const { messages } = conversationHistory.value;

    const formattedMessages: ChatMessage[] = [
      ...messages.map((msg) => ({
        role: msg.user.id === process.env.CHATBOT_ID ? "assistant" as const : "user" as const,
        content: msg.message,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    const completion = await openai.chat.completions.create(
      {
        model: "gpt-4o",
        messages: formattedMessages,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const responseMessage = completion.choices[0].message;

    if (responseMessage.content === null) {
      return Result.err(new Error());
    }

    const newMessage = await prisma.message.create({
      data: {
        message: responseMessage.content,
        user: {
          connect: { id: process.env.CHATBOT_ID },
        },
        conversation: {
          connect: { id: conversationId },
        },
      },
      include: {
        conversation: {
          include: {
            messages: {
              orderBy: {
                createdAt: "asc",
              },
              select: {
                id: true,
                message: true,
                userId: true,
                createdAt: true,
                // We don't need conversationId so i excluded it
              },
            },
          },
        },
      },
    });

    return Result.ok(newMessage.conversation);
  } catch (error) {
    return Result.err(new Error());
  }
};
