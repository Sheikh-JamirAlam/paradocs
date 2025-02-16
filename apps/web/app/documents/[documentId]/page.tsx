"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import useSocket from "@/app/hooks/SocketHook";
import MenubarNav from "@/app/components/Document/MenubarNav";
import Toolbar from "@/app/components/Document/Toolbar";
import { FontSize } from "@/app/lib/extensions/tiptap";
import { useAuth } from "@/app/hooks/useAuth";
import Loader from "@/app/components/Document/Loader";

export default function Page() {
  // const { documentId } = useParams();
  const { user, isLoading } = useAuth();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      Color,
      Image,
      ImageResize,
      Table,
      TableCell,
      TableHeader,
      TableRow,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      FontSize,
    ],
    editorProps: {
      attributes: {
        style: `padding-left: 51px; padding-right: 51px;`,
        class: "focus:outline-none print:boder-0 border bg-white border-gray-300 flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      updateContent(newContent);
    },
  });

  const { updateContent } = useSocket(editor);

  if (isLoading) return <Loader />;

  return (
    <div className="size-full overflow-x-auto bg-gray-100 px-4 print:p-0 print:bg-white print:overflow-visible">
      <div className="px-4 py-1 bg-gray-100 fixed top-0 left-0 right-0 z-10 print:hidden">
        <MenubarNav editor={editor} user={user} />
        <Toolbar editor={editor} />
      </div>
      <div className="min-w-max flex justify-center w-[816px] py-4 pt-32 print:py-0 mx-auto print:w-full print:min-w-0 font-[Arial]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
