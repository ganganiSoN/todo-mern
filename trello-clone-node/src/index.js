import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRouter from "./routes/auth.ts";
import todoRouter from "./routes/todo.ts";
import { createServer } from "http";
import { initializeSocket } from "./socket/index.js";
import { connectDB } from "./db/connection.ts";
import { initCollections } from "./db/initCollections.ts";
import todoTaskRoute from "./routes/todo-task.ts";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

(async () => {
  try {
    const server = createServer(app);
    const db = await connectDB();

    await initCollections(db);

    const io = initializeSocket(server);

    app.use((req, _, next) => {
      req.io = io;
      next();
    });

    app.use("/auth", userRouter);
    app.use("/todo", todoRouter);
    app.use("/todo-task", todoTaskRoute);

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
