// import { WebSocket, WebSocketServer } from "ws";
// import http from "http";

// const server = http.createServer(function (request: any, response: any) {
//   console.log(new Date() + " Received request for " + request.url);
//   response.end("hi there");
// });

// const wss = new WebSocketServer({ server });

// wss.on("connection", function connection(ws) {
//   ws.on("error", console.error);

//   ws.on("message", function message(data, isBinary) {
//     wss.clients.forEach(function each(client) {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(data, { binary: isBinary });
//       }
//     });
//   });
// });

import app from "./app";

const PORT = process.env.PORT ? process.env.PORT : 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// server.listen(PORT, () => {
//   console.log("HTTP Server started listening on port: " + PORT);
// });
