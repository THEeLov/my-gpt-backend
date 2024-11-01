"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messages_controller_1 = require("../controllers/messages.controller");
const protectedRoute_1 = require("../middlewares/protectedRoute");
const router = express_1.default.Router();
router.post("/", protectedRoute_1.protectedRoute, messages_controller_1.postMessage);
router.post("/:conversationId", protectedRoute_1.protectedRoute, messages_controller_1.postMessage);
exports.default = router;
