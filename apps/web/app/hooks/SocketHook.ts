"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";

export default function useSocket(editor: Editor | null) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080`);

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      setSocket(socket);
    };

    socket.onmessage = (message) => {
      if (editor) {
        const content = JSON.parse(message.data);
        editor.commands.setContent(content);
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      socket.close();
    };
  }, [editor]);

  const updateContent = (content: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(content));
    }
  };

  return { updateContent };
}
