"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
// Routes imports
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const messages_routes_1 = __importDefault(require("./routes/messages.routes"));
const conversation_routes_1 = __importDefault(require("./routes/conversation.routes"));
(0, dotenv_1.config)();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true, // Should be changed in real production
    credentials: true,
}));
app.use(express_1.default.json());
// Routing
app.use("/api/auth", auth_routes_1.default);
app.use("/api/messages", messages_routes_1.default);
app.use("/api/conversations", conversation_routes_1.default);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
exports.default = app;
