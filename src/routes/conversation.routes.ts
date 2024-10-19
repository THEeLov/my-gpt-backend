import express from "express"
import { protectedRoute } from "../middlewares/protectedRoute";
import { getConversationAllMessages, getConversations } from "../controllers/conversations.controller";

const router = express.Router();

router.get("/user/:userId", protectedRoute, getConversations)
router.get("/:conversationId", protectedRoute, getConversationAllMessages)


export default router;