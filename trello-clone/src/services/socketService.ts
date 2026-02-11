import { io, Socket } from "socket.io-client";
import type { IItem } from "./todoService";

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket) return this.socket;

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

    if (!SOCKET_URL) {
      console.error("VITE_SOCKET_URL is not defined");
      return null;
    }

    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    return this.socket;
  }

  //////////////// todo
  onAdd(handler: (tod: IItem) => void) {
    this.socket?.on("addNewToDo", handler);
  }

  onUpdate(handler: (tod: IItem) => void) {
    this.socket?.on("updateToDo", handler);
  }

  onDelete(handler: (tod: IItem) => void) {
    this.socket?.on("deleteToDo", handler);
  }

  offAdd(handler: (tod: IItem) => void) {
    this.socket?.off("addNewToDo", handler);
  }

  offUpdate(handler: (tod: IItem) => void) {
    this.socket?.off("updateToDo", handler);
  }

  offDelete(handler: (tod: IItem) => void) {
    this.socket?.off("deleteToDo", handler);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
