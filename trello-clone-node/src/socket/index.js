import { Server } from "socket.io";

let io;

export function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("::: user disconnected", socket.id);
    });
  });

  return io;
}

export function getIo() {
  if (!io) {
    throw new Error(
      "Socket.IO not initialized. Call initializeSocket(httpServer) first.",
    );
  }
  return io;
}
