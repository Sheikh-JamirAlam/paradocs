"use client";

import { useState, useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { WebSocket } from "ws";

const WS_URL = "ws://localhost:8080"; // Your backend WebSocket URL

export default function DocumentEditor({ documentId }: { documentId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket(WS_URL);
    setSocket(ws);

    ws.onopen = () => console.log("Connected to WebSocket server");

    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      console.log("Received Data:", receivedData);

      // Update editor content with incoming changes
      if (receivedData.documentId === documentId) {
        setContent(receivedData.content);
      }
    };

    return () => ws.close(); // Cleanup on component unmount
  }, [documentId]);

  const editor = useEditor({
    content: content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setContent(newContent);

      // Send content update to WebSocket server
      if (socket) {
        socket.send(JSON.stringify({ documentId, content: newContent }));
      }
    },
  });

  return (
    <div>
      <h1>Editing Document: {documentId}</h1>
      <EditorContent editor={editor} />
    </div>
  );
}
