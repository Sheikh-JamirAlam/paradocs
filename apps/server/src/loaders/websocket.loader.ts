import { Server } from "http";
import { WebSocketServer } from "ws";
import * as Y from "yjs";
import prisma from "../config/db";
import { verifyToken } from "../utils/jwt.service";

const { getYDoc, setPersistence, setupWSConnection } = require("y-websocket/bin/utils");

const pendingWrites = new Map<string, NodeJS.Timeout>();
const writeQueues = new Map<string, Promise<void>>();

const persistYjsState = (documentId: string, ydoc: Y.Doc) => {
  const yjsState = Buffer.from(Y.encodeStateAsUpdate(ydoc));

  const previousWrite = writeQueues.get(documentId) ?? Promise.resolve();

  const nextWrite = previousWrite
    .catch(() => {})
    .then(async () => {
      await prisma.document.update({
        where: { id: documentId },
        data: { yjsState },
      });
    });

  writeQueues.set(documentId, nextWrite);

  void nextWrite.finally(() => {
    if (writeQueues.get(documentId) === nextWrite) {
      writeQueues.delete(documentId);
    }
  });

  return nextWrite;
};

const scheduleYjsPersistence = (documentId: string, ydoc: Y.Doc) => {
  const existingTimer = pendingWrites.get(documentId);

  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(() => {
    pendingWrites.delete(documentId);

    void persistYjsState(documentId, ydoc).catch(console.error);
  }, 1_000);

  pendingWrites.set(documentId, timer);
};

const loading = new Map<string, Promise<void>>();

setPersistence({
  bindState(documentId: string, ydoc: Y.Doc) {
    const load = (async () => {
      const document = await prisma.document.findUnique({
        where: { id: documentId },
        select: { yjsState: true },
      });

      if (document?.yjsState) {
        Y.applyUpdate(ydoc, document.yjsState);
      }

      ydoc.on("update", () => {
        scheduleYjsPersistence(documentId, ydoc);
      });
    })();

    loading.set(documentId, load);
    void load.finally(() => loading.delete(documentId));
  },

  writeState: async (documentId: string, ydoc: Y.Doc) => {
    const pendingTimer = pendingWrites.get(documentId);

    if (pendingTimer) {
      clearTimeout(pendingTimer);
      pendingWrites.delete(documentId);
    }

    await persistYjsState(documentId, ydoc);
  },
});

export const initializeWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", async (request, socket, head) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    const match = url.pathname.match(/^\/collaboration\/([^/]+)$/);

    if (!match) {
      socket.destroy();
      return;
    }

    try {
      const documentId = decodeURIComponent(match[1]);
      const token = url.searchParams.get("token");

      if (!token) throw new Error("Missing token");

      const payload = await verifyToken(token);
      const canAccess = await prisma.document.findFirst({
        where: {
          id: documentId,
          OR: [
            { ownerId: payload.id },
            {
              collaborators: {
                some: {
                  userId: payload.id,
                },
              },
            },
          ],
        },
        select: { id: true },
      });

      if (!canAccess) {
        throw new Error("Forbidden");
      }

      getYDoc(documentId);
      await loading.get(documentId);

      wss.handleUpgrade(request, socket, head, (connection) => {
        setupWSConnection(connection, request, { docName: documentId });
      });
    } catch {
      socket.destroy();
    }
  });
};
