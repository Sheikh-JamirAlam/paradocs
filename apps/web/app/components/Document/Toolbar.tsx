"use client";

import { Editor } from "@tiptap/react";
import { Bold, Italic, Underline, List, ListOrdered, CheckSquare } from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  return (
    <div className="mt-4 px-4 py-1 flex gap-1 bg-slate-200 rounded-full">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-md cursor-pointer ${editor.isActive("bold") ? "bg-gray-300" : "hover:bg-gray-300"}`}>
        <Bold size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-md cursor-pointer ${editor.isActive("italic") ? "bg-gray-300" : "hover:bg-gray-300"}`}>
        <Italic size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded-md cursor-pointer ${editor.isActive("underline") ? "bg-gray-300" : "hover:bg-gray-300"}`}>
        <Underline size={16} />
      </button>
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
  );
}
