import { io, Socket } from "socket.io-client";
import type { IItem } from "../../services/todoService";

class SocketService {
  private socket: Socket | null = null;

  constructor() {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

    this.socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }

  connect() {
    if (!this.socket?.connected) {
      this.socket?.connect();
      console.log("::: socket connected");
    }
  }

  disconnect() {
    if (this.socket?.connected) {
      this.socket?.disconnect();
      console.log("::: socket disconnected");
    }
  }

  getSocket() {
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
}

export const socketService = new SocketService();
