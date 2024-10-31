import { ChatMessage, MessageWithUser } from "../types"

export const formatChatHistory = (messages: MessageWithUser[], message: string) => {
  const formattedMessages: ChatMessage[] = [
    ...messages.map((msg) => ({
      role:
        msg.user.id === process.env.CHATBOT_ID
          ? ("assistant" as const)
          : ("user" as const),
      content: msg.message,
    })),
    {
      role: "user",
      content: message,
    },
  ];

  return formattedMessages;
}