import express from "express";
import cors from "cors";
import { config } from "dotenv";

// Routes imports
import authRoutes from "./routes/auth.routes";
import messagesRoutes from "./routes/messages.routes";
import conversationsRoutes from "./routes/conversation.routes"

config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: true, // This should be changed for real production 
    credentials: true,
  })
);

app.use(express.json());

// Routing
app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/conversations", conversationsRoutes)

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
