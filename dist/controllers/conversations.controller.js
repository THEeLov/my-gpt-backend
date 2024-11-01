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
exports.getConversationAllMessages = exports.getConversations = void 0;
const conversations_repository_1 = require("../repositories/conversations.repository");
const databaseErrors_1 = require("../errors/databaseErrors");
const getConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const result = yield (0, conversations_repository_1.getConversationsOfUser)(userId);
    if (result.isOk) {
        return res.status(200).json(result.value);
    }
    return res.status(500).json({ error: "Internal server error" });
});
exports.getConversations = getConversations;
const getConversationAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const conversationId = req.params.conversationId;
    const result = yield (0, conversations_repository_1.getConversationMessages)(conversationId, req.user.id);
    if (result.isOk) {
        return res.status(200).json(result.value);
    }
    const error = result.error;
    if (error instanceof databaseErrors_1.NoConversationFound) {
        return res.status(404).json({ error: "No conversation was found" });
    }
    if (error instanceof databaseErrors_1.PermissionError) {
        return res
            .status(401)
            .json({ error: "You are not authorized to get this converstion" });
    }
    return res.status(500).json({ error: "Internal server error" });
});
exports.getConversationAllMessages = getConversationAllMessages;
