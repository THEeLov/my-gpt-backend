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
exports.getConversationHistory = exports.getConversationMessages = exports.getConversationsOfUser = exports.createConversation = void 0;
const result_1 = require("@badrap/result");
const client_1 = __importDefault(require("../client"));
const databaseErrors_1 = require("../errors/databaseErrors");
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default();
/**
 * Creates a new conversation with a headline that AI created and two participants: the user and the chatbot.
 *
 * @param {string} message - The message content sent by the user.
 * @param {string} userId - The ID of the user who initiates the conversation.
 * @returns {Promise<DbResult<Conversation>>} A promise that resolves to a `DbResult` object containing
 * either the successfully created conversation or an error.
 *
 */
const createConversation = (message, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get a headline from AI
        const completion = yield openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    "role": "user",
                    "content": `Create a headline from this question user posted (make it as short as possible, just some keywords): ${message}`
                }
            ],
            temperature: 0.7,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        const newConversation = yield client_1.default.conversation.create({
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
        return result_1.Result.ok(newConversation);
    }
    catch (error) {
        return result_1.Result.err(new Error());
    }
});
exports.createConversation = createConversation;
/**
 * Retrieves all conversations for a specified user.
 *
 * @param {string} userId - The ID of the user for whom to retrieve conversations.
 * @returns {Promise<DbResult<Conversation[]>>} A promise that resolves to a `DbResult` containing:
 * - An array of `Conversation` objects if successful.
 * - An error if the operation fails.
 *
 */
const getConversationsOfUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversations = yield client_1.default.conversation.findMany({
            where: {
                participants: {
                    some: { id: userId },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return result_1.Result.ok(conversations);
    }
    catch (error) {
        return result_1.Result.err(new Error());
    }
});
exports.getConversationsOfUser = getConversationsOfUser;
/**
 * Retrieves a conversation along with its associated messages and user information for each message.
 *
 * @param {string} conversationId - The ID of the conversation to retrieve.
 * @returns {Promise<DbResult<ConversationWithMessages>>} A promise that resolves to a `DbResult` containing:
 * - The `ConversationWithMessages` object if successful, which includes the conversation details and its messages.
 * - An error if the operation fails or if the conversation does not exist.
 *
 */
const getConversationMessages = (conversationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversationsWithMessages = yield client_1.default.conversation.findUnique({
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
            return result_1.Result.err(new databaseErrors_1.NoConversationFound());
        }
        const isUserParticipant = conversationsWithMessages.participants.some((participant) => participant.id === userId);
        if (!isUserParticipant) {
            return result_1.Result.err(new databaseErrors_1.PermissionError());
        }
        return result_1.Result.ok(conversationsWithMessages);
    }
    catch (error) {
        return result_1.Result.err(new Error());
    }
});
exports.getConversationMessages = getConversationMessages;
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
const getConversationHistory = (conversationId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conversationsWithMessages = yield client_1.default.conversation.findUnique({
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
            return result_1.Result.err(new databaseErrors_1.NoConversationFound());
        }
        return result_1.Result.ok(conversationsWithMessages);
    }
    catch (error) {
        return result_1.Result.err(new Error());
    }
});
exports.getConversationHistory = getConversationHistory;
