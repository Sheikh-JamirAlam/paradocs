"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
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
import useSocket from "../../components/SocketHook";
import Toolbar from "../../components/Document/Toolbar";
import { PreserveSpaces, FontSize } from "../../lib/extensions/tiptap";

export default function Page() {
  // const { documentId } = useParams();
  // const { content, updateContent } = useSocket();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      Color,
      Image,
      ImageResize,
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
    // content: content,
    immediatelyRender: false,
    // onUpdate: ({ editor }) => {
    //   const newContent = editor.getHTML();
    //   updateContent(newContent);
    // },
  });

  // useEffect(() => {
  //   editor?.commands.setContent(content);
  // }, [content, editor]);

  return (
    <div className="size-full overflow-x-auto bg-gray-100 px-4 print:p-0 print:bg-white print:overflow-visible">
      <div className="print:hidden">
        <Toolbar editor={editor} />
      </div>
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0 font-[Arial]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
