"use client";

import { Editor } from "@tiptap/react";
import { Bold, Italic, Underline, List, ListOrdered, CheckSquare, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  return (
    <div className="mt-4 px-4 py-1 flex gap-1 items-center bg-slate-200 rounded-full">
      <div className="w-[1px] h-5 mx-2 bg-gray-400" />
      <div className="flex gap-1">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-md cursor-pointer ${editor.isActive("bold") ? "bg-gray-300" : "hover:bg-gray-300"}`}>
          <Bold size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-md cursor-pointer ${editor.isActive("italic") ? "bg-gray-300" : "hover:bg-gray-300"}`}>
          <Italic size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded-md cursor-pointer ${editor.isActive("underline") ? "bg-gray-300" : "hover:bg-gray-300"}`}>
          <Underline size={16} />
        </button>
      </div>
      <div className="w-[1px] h-5 mx-2 bg-gray-400" />
      <div className="flex gap-1">
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-md cursor-pointer ${editor.isActive("bulletList") ? "bg-gray-300" : "hover:bg-gray-300"}`}>
          <List size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded-md cursor-pointer ${editor.isActive("orderedList") ? "bg-gray-300" : "hover:bg-gray-300"}`}>
          <ListOrdered size={16} />
        </button>
        <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={`p-2 rounded-md cursor-pointer ${editor.isActive("taskList") ? "bg-gray-300" : "hover:bg-gray-300"}`}>
          <CheckSquare size={16} />
        </button>
      </div>
      <div className="flex gap-1">
        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded-md cursor-pointer ${editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : "hover:bg-gray-300"}`}
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-md cursor-pointer ${editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : "hover:bg-gray-300"}`}
        >
          <Heading2 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-md cursor-pointer ${editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : "hover:bg-gray-300"}`}
        >
          <Heading3 size={16} />
        </button>

        {/* Text Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded-md cursor-pointer ${editor.isActive({ textAlign: "left" }) ? "bg-gray-300" : "hover:bg-gray-300"}`}
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded-md cursor-pointer ${editor.isActive({ textAlign: "center" }) ? "bg-gray-300" : "hover:bg-gray-300"}`}
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded-md cursor-pointer ${editor.isActive({ textAlign: "right" }) ? "bg-gray-300" : "hover:bg-gray-300"}`}
        >
          <AlignRight size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`p-2 rounded-md cursor-pointer ${editor.isActive({ textAlign: "justify" }) ? "bg-gray-300" : "hover:bg-gray-300"}`}
        >
          <AlignJustify size={16} />
        </button>
      </div>
    </div>
  );
}
