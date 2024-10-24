import express from "express";
import cors from "cors";
import { config } from "dotenv";

// Routes imports
import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/messages.routes";

config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Routing
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
