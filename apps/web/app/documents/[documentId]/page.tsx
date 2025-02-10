"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { useParams } from "next/navigation";
import useSocket from "../../components/SocketHook";
import StarterKit from "@tiptap/starter-kit";
import { PreserveSpaces } from "../../lib/extensions/tiptap";

export default function Page() {
  const { documentId } = useParams();
  const { content, updateContent } = useSocket();

  const editor = useEditor({
    extensions: [StarterKit, PreserveSpaces],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      updateContent(newContent);
    },
  });

  useEffect(() => {
    editor?.commands.setContent(content);
  }, [content, editor]);

  return (
    <div>
      <h1>Editing Document: {documentId}</h1>
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  );
}
