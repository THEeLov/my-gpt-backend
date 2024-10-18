import express from "express"
import { protectedRoute } from "../middlewares/protectedRoute";
import { getConversations } from "../controllers/conversations.controller";
import { getConversationMessages } from "../repositories/conversations.repository";

const router = express.Router();

router.get("/user/:userId", protectedRoute, getConversations)
router.get("/:conversationId", protectedRoute, getConversationMessages)


export default router;