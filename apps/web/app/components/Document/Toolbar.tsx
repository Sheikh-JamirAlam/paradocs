"use client";

import { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  CheckSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
  Undo2,
  Redo2,
  Baseline,
  Highlighter,
  Link2,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Chrome from "@uiw/react-color-chrome";
import { GithubPlacement } from "@uiw/react-color-github";

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
  const fontFamilies = ["Arial", "Times New Roman", "Inter", "'Comic Sans MS', 'Comic Sans'", "Courier New", "Verdana", "var(--font-sans)"];
  if (!editor) return null;

  return (
    <div className="flex gap-1">
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className={`w-[100px] px-2 py-1 flex items-center justify-between font-medium outline-0 rounded-md cursor-pointer ${isOpen ? "bg-gray-300" : "hover:bg-gray-300"}`}>
          <span className="truncate">
            {editor.getAttributes("textStyle").fontFamily === "'Comic Sans MS', 'Comic Sans'"
              ? "Comic Sans"
              : editor.getAttributes("textStyle").fontFamily === "var(--font-sans)"
                ? "Open Sans"
                : editor.getAttributes("textStyle").fontFamily || "Arial"}
          </span>
          <ChevronDownIcon size={16} className="shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {fontFamilies.map((family) => (
            <DropdownMenuItem key={family} onClick={() => editor.chain().focus().setFontFamily(family).run()} className="px-4 py-2 cursor-pointer" style={{ fontFamily: family }}>
              {family === "'Comic Sans MS', 'Comic Sans'" ? "Comic Sans" : family === "var(--font-sans)" ? "Open Sans" : family}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function FontSizeSelect({ editor }: ToolbarProps) {
  const currentFontSize = editor?.getAttributes("textStyle").fontSize ? editor?.getAttributes("textStyle").fontSize.replace("px", "") : "16";
  const [inputValue, setInputValue] = useState(currentFontSize);

  useEffect(() => {
    setInputValue(currentFontSize);
  }, [currentFontSize]);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!isNaN(size) && (size > 0 || size < 300)) {
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setInputValue(newSize);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const increment = () => {
    const newSize = parseInt(inputValue) + 1;
    if (newSize < 300) {
      updateFontSize(newSize.toString());
    }
  };

  const decrement = () => {
    const newSize = parseInt(inputValue) - 1;
    if (newSize > 0) {
      updateFontSize(newSize.toString());
    }
  };

  if (!editor) return null;

  return (
    <div className="flex gap-0.5 items-center">
      <button className="p-2 rounded-md cursor-pointer hover:bg-gray-300">
        <MinusIcon size={16} onClick={decrement} />
      </button>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => updateFontSize(inputValue)}
        onKeyDown={handleKeyDown}
        type="text"
        className="w-[30px] h-6 px-1 py-1 leading-loose my-auto text-center text-sm font-medium border border-gray-500 rounded-sm focus:outline outline-lime-700"
      />
      <button className="p-2 rounded-md cursor-pointer hover:bg-gray-300">
        <PlusIcon size={16} onClick={increment} />
      </button>
    </div>
  );
}

function ColorPicker({ editor }: ToolbarProps) {
  const [color, setColor] = useState("#000000");
  const [isOpen, setIsOpen] = useState(false);

  const applyColor = (newColor: string) => {
    setColor(newColor);
    editor?.chain().focus().setColor(newColor).run();
  };

  if (!editor) return null;

  return (
    <div className="flex gap-1">
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className={`px-2 py-1 flex items-center justify-between font-medium outline-0 rounded-md cursor-pointer ${isOpen ? "bg-gray-300" : "hover:bg-gray-300"}`}>
          <Baseline size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0 rounded-none">
          <Chrome color={color} showAlpha={false} onChange={(color) => applyColor(color.hex)} placement={GithubPlacement.Left} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function HighlightColorPicker({ editor }: ToolbarProps) {
  const [color, setColor] = useState("#FFFFFF");
  const [isOpen, setIsOpen] = useState(false);

  const applyColor = (newColor: string) => {
    setColor(newColor);
    editor?.chain().focus().setHighlight({ color: newColor }).run();
  };

  if (!editor) return null;

  return (
    <div className="flex gap-1">
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className={`px-2 py-1 flex items-center justify-between font-medium outline-0 rounded-md cursor-pointer ${isOpen ? "bg-gray-300" : "hover:bg-gray-300"}`}>
          <Highlighter size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0 rounded-none">
          <Chrome color={color} showAlpha={false} onChange={(color) => applyColor(color.hex)} placement={GithubPlacement.Left} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function LinkOption({ editor }: ToolbarProps) {
  const [url, setUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const addLink = () => {
    if (!url) return;

    editor?.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
    editor?.chain().focus().toggleUnderline().run();

    setIsOpen(false);
    setUrl("");
  };

  const removeLink = () => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setIsOpen(false);
  };

  if (!editor) return null;

  return (
    <div className="flex gap-1">
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className={`px-2 py-1 flex items-center justify-between font-medium outline-0 rounded-md cursor-pointer ${isOpen ? "bg-gray-300" : "hover:bg-gray-300"}`}>
          <Link2 size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0 rounded-none">
          <Input type="url" placeholder="Enter link" value={url} onChange={(e) => setUrl(e.target.value)} className="mb-2" />
          <div className="flex gap-2">
            <button onClick={addLink} disabled={!url}>
              Insert
            </button>
            <button onClick={removeLink} disabled={!editor.isActive("link")}>
              Remove
            </button>
          </div>
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
      <div className="flex gap-1">
        <button onClick={() => editor.chain().focus().undo().run()} className="p-2 rounded-md cursor-pointer hover:bg-gray-300">
          <Undo2 size={16} />
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} className="p-2 rounded-md cursor-pointer hover:bg-gray-300">
          <Redo2 size={16} />
        </button>
      </div>
      <div className="w-[1px] h-5 mx-2 bg-gray-400" />
      <HeadingSelect editor={editor} />
      <div className="w-[1px] h-5 mx-2 bg-gray-400" />
      <FontFamilySelect editor={editor} />
      <div className="w-[1px] h-5 mx-2 bg-gray-400" />
      <FontSizeSelect editor={editor} />
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
        <ColorPicker editor={editor} />
        <HighlightColorPicker editor={editor} />
      </div>
      <div className="w-[1px] h-5 mx-2 bg-gray-400" />
      <div className="flex gap-1">
        <LinkOption editor={editor} />
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
