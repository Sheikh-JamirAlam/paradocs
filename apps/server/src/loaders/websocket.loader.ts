import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

interface User {
  id: string;
  name: string;
}

interface DocumentState {
  users: Record<string, User>;
}

const documents: Record<string, DocumentState> = {};

export const initializeWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  function broadcast(ws: WebSocket, docId: string, data: any) {
    if (data.type === "presence") {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ docId, ...data }));
        }
      });
    } else {
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ docId, ...data }));
        }
      });
    }
  }

  wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket connection established");

    let userId: string;
    let documentId: string;

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        const { type, docId, user, content } = message;

        documentId = docId;
        userId = user?.id;

        if (!documents[docId]) {
          documents[docId] = { users: {} };
        }

        if (type === "join") {
          documents[docId].users[userId] = {
            id: userId,
            name: user?.name,
          };
          broadcast(ws, docId, { type: "presence", users: documents[docId].users });
        }

        if (type === "update") {
          broadcast(ws, docId, { type: "content", content });
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    ws.on("close", () => {
      if (documentId && userId) {
        if (documents[documentId]) {
          delete documents[documentId].users[userId];

          if (Object.keys(documents[documentId].users).length === 0) {
            delete documents[documentId];
          }

          broadcast(ws, documentId, { type: "presence", users: documents[documentId]?.users || {} });
        }
      }
    });

    ws.on("error", console.error);
  });
};
