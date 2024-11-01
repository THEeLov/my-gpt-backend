"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatChatHistory = void 0;
const formatChatHistory = (messages, message) => {
    const formattedMessages = [
        ...messages.map((msg) => ({
            role: msg.user.id === process.env.CHATBOT_ID
                ? "assistant"
                : "user",
            content: msg.message,
        })),
        {
            role: "user",
            content: message,
        },
    ];
    return formattedMessages;
};
exports.formatChatHistory = formatChatHistory;
