"use client";

import { useEffect, useState } from "react";
import { BACKEND_URL } from "../lib/constants/urls";

export default function useSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const socket = new WebSocket(`ws://${BACKEND_URL}`);
    socket.onopen = () => {
      console.log("Connected to server");
      setSocket(socket);
    };
    socket.onmessage = (message) => {
      setContent(message.data);
    };
    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      socket.close();
    };
  }, []);

  const updateContent = (message: string) => {
    setContent(message);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  };

  return { content, updateContent };
}
