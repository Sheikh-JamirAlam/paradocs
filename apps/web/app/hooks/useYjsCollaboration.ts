"use client";

import { useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { BACKEND_URL } from "@/app/lib/constants/urls";
import { getSession } from "@/app/server/actions/sessions";

export function useYjsCollaboration(documentId: string | undefined, user: { id: string; name: string } | null, enabled: boolean) {
  const [connection, setConnection] = useState<{
    fragment: Y.XmlFragment;
    provider: WebsocketProvider;
  } | null>(null);

  const cursorColors = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#ea580c", "#0891b2", "#db2777"];

  const getUserColor = (userId: string) => {
    let hash = 0;

    for (let i = 0; i < userId.length; i++) {
      hash = (hash << 5) - hash + userId.charCodeAt(i);
      hash |= 0;
    }

    return cursorColors[Math.abs(hash) % cursorColors.length];
  };

  useEffect(() => {
    if (!documentId || !user || !enabled) return;

    let disposed = false;
    const ydoc = new Y.Doc();
    const fragment = ydoc.getXmlFragment("prosemirror");
    let provider: WebsocketProvider | null = null;

    const connect = async () => {
      const token = await getSession();
      if (!token || disposed) return;

      const wsUrl = `${BACKEND_URL.replace(/^http/, "ws")}/collaboration`;

      provider = new WebsocketProvider(wsUrl, documentId, ydoc, {
        params: { token },
        disableBc: true,
      });

      provider.awareness.setLocalStateField("user", {
        name: user.name,
        color: getUserColor(user.id),
      });

      if (!disposed) {
        setConnection({ fragment, provider });
      }
    };

    void connect();

    return () => {
      disposed = true;
      provider?.destroy();
      ydoc.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, user?.id, user?.name, enabled]);

  return connection;
}
