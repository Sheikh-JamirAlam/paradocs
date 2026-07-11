"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";

interface User {
  id: string;
  name: string;
  cursor?: { x: number; y: number; height: number };
}

interface Cursor {
  position: { x: number; y: number };
  height: number;
}

export default function useSocket(editor: Editor | null, docId: string | string[] | undefined, user: User | null) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [cursor, setCursor] = useState<Record<string, Cursor>>({});

  useEffect(() => {
    if (!docId || !user) return;
    const socket = new WebSocket(`ws://localhost:8080`);

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      setSocket(socket);
      socket.send(JSON.stringify({ type: "join", docId, user }));
    };

    socket.onmessage = (message) => {
      const { type, content, users, userIdCursor, cursor } = JSON.parse(message.data);

      if (type === "content" && editor) {
        editor.commands.setContent(content);
      }

      if (type === "presence") {
        setUsers(users);
      }

      if (type === "cursor-position") {
        setCursor((prev) => ({
          ...prev,
          [userIdCursor]: {
            position: { x: cursor.x, y: cursor.y },
            height: cursor.height,
          },
        }));
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    return () => {
      socket.close();
    };
  }, [editor, docId, user]);

  const updateContent = (content: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "update", docId, content }));
    }
  };

  const updateCursor = (userIdCursor: string, x: number, y: number, height: number) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "update", docId, userIdCursor, cursor: { x, y, height } }));
    }
  };

  return { updateContent, updateCursor, users, cursor };
}
