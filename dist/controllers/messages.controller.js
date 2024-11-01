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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMessage = void 0;
const conversations_repository_1 = require("../repositories/conversations.repository");
const messages_repository_1 = require("../repositories/messages.repository");
const postMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conversationId = req.params.conversationId;
    const { message } = req.body;
    // Create or add user message to the conversation, then add chat gpt response
    const result = conversationId === undefined
        ? yield (0, conversations_repository_1.createConversation)(message, req.user.id)
        : yield (0, messages_repository_1.createMessage)(conversationId, message, req.user.id);
    if (result.isOk) {
        // Now add response to the conversation
        const newResult = yield (0, messages_repository_1.getChatResponseMessage)(message, result.value.id);
        if (newResult.isOk) {
            return res.status(201).json(newResult.value);
        }
        return res
            .status(500)
            .json({ error: "Interanl server error - chat response" });
    }
    return res.status(500).json({ error: "Internal server error - new message" });
});
exports.postMessage = postMessage;
