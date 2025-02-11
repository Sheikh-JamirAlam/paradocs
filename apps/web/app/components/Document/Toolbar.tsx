"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";
import { Bold, Italic, Underline, List, ListOrdered, CheckSquare, AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDownIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ToolbarProps {
  editor: Editor | null;
}

function HeadingSelect({ editor }: ToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  if (!editor) return null;

  return (
    <div className="flex gap-1">
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className={`w-[130px] px-2 py-1 flex items-center justify-between font-medium outline-0 ${isOpen ? "bg-gray-300" : "hover:bg-gray-300"} rounded-md cursor-pointer`}>
          {editor.isActive("heading", { level: 1 }) ? "Heading 1" : editor.isActive("heading", { level: 2 }) ? "Heading 2" : editor.isActive("heading", { level: 3 }) ? "Heading 3" : "Normal Text"}
          <ChevronDownIcon size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()} className="px-4 py-2 text-base border-b border-gray-200 rounded-b-none cursor-pointer">
            Normal Text
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="px-4 py-2 text-[32px] border-b border-gray-200 rounded-b-none cursor-pointer">
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-4 py-2 text-2xl border-b border-gray-200 rounded-b-none cursor-pointer">
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="px-4 py-2 text-xl cursor-pointer">
            Heading 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function FontFamilySelect({ editor }: ToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fontFamilies = ["Arial", "Times New Roman", "Inter", "'Comic Sans MS', 'Comic Sans'", "cursive", "Courier New", "Verdana"];
  if (!editor) return null;

  return (
    <div className="flex gap-1">
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className={`w-[130px] px-2 py-1 flex items-center justify-between font-medium outline-0 rounded-md cursor-pointer ${isOpen ? "bg-gray-300" : "hover:bg-gray-300"}`}>
          Font Family
          <ChevronDownIcon size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {fontFamilies.map((family) => (
            <DropdownMenuItem key={family} onClick={() => editor.chain().focus().setFontFamily(family).run()} className="px-4 py-2 cursor-pointer" style={{ fontFamily: family }}>
              {family}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function AlignSelect({ editor }: ToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  if (!editor) return null;

  return (
    <div className="flex gap-1">
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className={`w-[40px] px-1 py-2 flex items-center justify-between outline-0 ${isOpen ? "bg-gray-300" : "hover:bg-gray-300"} rounded-md cursor-pointer`}>
          {editor.isActive({ textAlign: "justify" }) ? (
            <AlignJustify size={16} className="text-black" />
          ) : editor.isActive({ textAlign: "right" }) ? (
            <AlignRight size={16} className="text-black" />
          ) : editor.isActive({ textAlign: "center" }) ? (
            <AlignCenter size={16} className="text-black" />
          ) : (
            <AlignLeft size={16} className="text-black" />
          )}
          <ChevronDownIcon size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("left").run()} className="px-2 py-2 border-b border-gray-200 rounded-b-none cursor-pointer">
            <AlignLeft size={16} className="text-black" />
            Align Left
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("center").run()} className="px-2 py-2 border-b border-gray-200 rounded-b-none cursor-pointer">
            <AlignCenter size={16} className="text-black" />
            Align Center
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("right").run()} className="px-2 py-2 border-b border-gray-200 rounded-b-none cursor-pointer">
            <AlignRight size={16} className="text-black" />
            Align Right
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().setTextAlign("justify").run()} className="px-2 py-2 cursor-pointer">
            <AlignJustify size={16} className="text-black" />
            Justify
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  return (
    <div className="mt-4 px-4 py-1 flex items-center bg-slate-200 rounded-full">
      <HeadingSelect editor={editor} />
      <div className="w-[1px] h-5 mx-2 bg-gray-400" />
      <FontFamilySelect editor={editor} />
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
        <AlignSelect editor={editor} />
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
    </div>
  );
}
