"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const protectedRoute_1 = require("../middlewares/protectedRoute");
const conversations_controller_1 = require("../controllers/conversations.controller");
const router = express_1.default.Router();
router.get("/user/:userId", protectedRoute_1.protectedRoute, conversations_controller_1.getConversations);
router.get("/:conversationId", protectedRoute_1.protectedRoute, conversations_controller_1.getConversationAllMessages);
exports.default = router;
