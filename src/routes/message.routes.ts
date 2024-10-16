import express from "express"
import { postMessage } from "../controllers/message.controller";

const router = express.Router();

router.post("/:id", postMessage);

export default router;