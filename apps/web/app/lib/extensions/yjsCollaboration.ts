import { Extension } from "@tiptap/core";
import { yCursorPlugin, ySyncPlugin, yUndoPlugin } from "y-prosemirror";
import type { Awareness } from "y-protocols/awareness";
import type * as Y from "yjs";

export const createYjsCollaborationExtension = (fragment: Y.XmlFragment, awareness: Awareness) =>
  Extension.create({
    name: "yjsCollaboration",

    addProseMirrorPlugins() {
      return [ySyncPlugin(fragment), yCursorPlugin(awareness), yUndoPlugin()];
    },
  });
