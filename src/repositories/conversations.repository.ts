import { Result } from "@badrap/result"
import { Conversation, DbResult } from "../types"
import prisma from "../client"


export const createConversation = async (message: string, userId: string): Promise<DbResult<Conversation>> => {
  
  try {

    const newConversation = await prisma.conversation.create({
      data: {
        name: message,
        participants: {
          connect: [
            { id: userId},
            { id: process.env.CHATBOT_ID }
          ]
        },
        messages: {
          create: {
            message: message,
            user: {
              connect: { id: userId }
            },
          }
        }
      },
    })

    return Result.ok(newConversation);

  } catch (error) {
    return Result.err(new Error());
  }
}