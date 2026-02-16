import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { socketService } from "../services/socketService";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    socketService.connect();

    setSocket(socketService.getSocket());

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
