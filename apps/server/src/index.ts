import { createServer } from "http";
import app from "./app";
import { initializeWebSocket } from "./loaders/websocket.loader";

const PORT = process.env.PORT ? process.env.PORT : 8080;

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on Port: ${PORT}`);
});

initializeWebSocket(server);
