"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatResponseMessage = exports.createMessage = void 0;
const result_1 = require("@badrap/result");
const client_1 = __importDefault(require("../client"));
const openai_1 = __importDefault(require("openai"));
const conversations_repository_1 = require("./conversations.repository");
const formatChatHistory_1 = require("../utils/formatChatHistory");
const openai = new openai_1.default();
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
const createMessage = (conversationId, message, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newMessage = yield client_1.default.message.create({
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
        return result_1.Result.ok(newMessage.conversation);
    }
    catch (error) {
        return result_1.Result.err(new Error());
    }
});
exports.createMessage = createMessage;
const getChatResponseMessage = (message, conversationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversationHistory = yield (0, conversations_repository_1.getConversationHistory)(conversationId);
        if (conversationHistory.isErr) {
            return result_1.Result.err(conversationHistory.error);
        }
        // Format chat history
        const { messages } = conversationHistory.value;
        const formattedMessages = (0, formatChatHistory_1.formatChatHistory)(messages, message);
        const completion = yield openai.chat.completions.create({
            model: "gpt-4o",
            messages: formattedMessages,
            temperature: 0.7,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        const responseMessage = completion.choices[0].message;
        if (responseMessage.content === null) {
            return result_1.Result.err(new Error());
        }
        const result = yield client_1.default.message.create({
            data: {
                message: responseMessage.content,
                user: {
                    connect: { id: process.env.CHATBOT_ID },
                },
                conversation: {
                    connect: { id: conversationId },
                },
            },
        });
        return result_1.Result.ok(result.conversationId);
    }
    catch (error) {
        return result_1.Result.err(new Error());
    }
});
exports.getChatResponseMessage = getChatResponseMessage;
