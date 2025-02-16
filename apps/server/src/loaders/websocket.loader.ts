import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";

export const initializeWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws: WebSocket) => {
    console.log("New WebSocket connection established");

    ws.on("message", (data) => {
      try {
        const content = JSON.parse(data.toString());

        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(content));
          }
        });
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    ws.on("error", console.error);
  });
};
