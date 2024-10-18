import express from "express"
import { postMessage } from "../controllers/messages.controller";
import { protectedRoute } from "../middlewares/protectedRoute";

const router = express.Router();

router.post("/:id", protectedRoute, postMessage);

export default router;