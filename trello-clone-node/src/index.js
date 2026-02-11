import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRouter from "./routes/auth.ts";
import todoRouter from "./routes/todo.ts";
import { createServer } from "http";
import { initializeSocket } from "./socket/index.js";
import { connectDB } from "./db/connection.ts";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  try {
    const server = createServer(app);
    await connectDB();

    const io = initializeSocket(server);

    app.use((req, _, next) => {
      req.io = io;
      next();
    });

    app.use("/auth", userRouter);
    app.use("/todo", todoRouter);

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
