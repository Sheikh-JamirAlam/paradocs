"use client";

import { useRef, useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar";
import { Text, File, FileJson, FilePlus, FileText, Globe, Printer, Redo2, Undo2, Bold, Strikethrough, Italic, Underline, RemoveFormatting, Image } from "lucide-react";
import { CloudDone, PdfFile } from "../Icons";

interface ToolbarProps {
  editor: Editor | null;
}

export default function MenubarNav({ editor }: ToolbarProps) {
  const [docName, setDocName] = useState("Document Name");
  const [inputWidth, setInputWidth] = useState(108);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      const width = spanRef.current.offsetWidth;
      setInputWidth(width);
    }
  }, [docName]);

  return (
    <nav className="w-full px-4 py-2 flex gap-2">
      <div className="text-4xl font-semibold font-serif underline">Paradocs</div>
      <div className="flex flex-col">
        <div className="font-medium flex items-center gap-1">
          <span ref={spanRef} className="px-2 text-lg invisible absolute whitespace-pre" aria-hidden="true">
            {docName}
          </span>
          <input className="w-fit px-2 text-lg" onChange={(e) => setDocName(e.target.value)} type="text" value={docName} style={{ width: `${inputWidth}px` }} />
          <CloudDone className="text-lg" />
        </div>
        <div className="flex">
          <Menubar className="h-auto p-0 border-none bg-transparent shadow-none">
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-0.5 px-2 rounded-sm hover:bg-gray-200 cursor-pointer">File</MenubarTrigger>
              <MenubarContent className="print:hidden">
                <MenubarSub>
                  <MenubarSubTrigger className="cursor-pointer">
                    <File className="size-4 mr-2 text-black" /> Save
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem className="cursor-pointer">
                      <FileJson className="size-4 mr-2 text-black" />
                      JSON
                    </MenubarItem>
                    <MenubarItem className="cursor-pointer">
                      <Globe className="size-4 mr-2 text-black" />
                      HTML
                    </MenubarItem>
                    <MenubarItem className="cursor-pointer" onClick={() => window.print()}>
                      <PdfFile className="size-4 mr-2 text-black" />
                      PDF
                    </MenubarItem>
                    <MenubarItem className="cursor-pointer">
                      <FileText className="size-4 mr-2 text-black" />
                      Text
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarItem className="cursor-pointer">
                  <FilePlus className="size-4 mr-2 text-black" />
                  New Document
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem className="cursor-pointer" onClick={() => window.print()}>
                  <Printer className="size-4 mr-2 text-black" />
                  Print <MenubarShortcut>&#x2318; + P</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-0.5 px-2 rounded-sm hover:bg-gray-200 cursor-pointer">Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem className="cursor-pointer" onClick={() => editor?.chain().focus().undo().run()}>
                  <Undo2 className="size-4 mr-2 text-black" />
                  Undo <MenubarShortcut>&#x2318; + Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem className="cursor-pointer" onClick={() => editor?.chain().focus().redo().run()}>
                  <Redo2 className="size-4 mr-2 text-black" />
                  Redo <MenubarShortcut>&#x2318; + Y</MenubarShortcut>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-0.5 px-2 rounded-sm hover:bg-gray-200 cursor-pointer">Insert</MenubarTrigger>
              <MenubarContent>
                <MenubarSub>
                  <MenubarSubTrigger className="cursor-pointer">
                    <Image className="size-4 mr-2 text-black" /> Image
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem className="cursor-pointer">Table</MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSub>
                  <MenubarSubTrigger className="cursor-pointer">Table</MenubarSubTrigger>
                  <MenubarSubContent>
                    {/* <MenubarItem onClick={() => insertTable({ rows: 1, cols: 1 })}>1 x 1</MenubarItem>
                    <MenubarItem onClick={() => insertTable({ rows: 2, cols: 2 })}>2 x 2</MenubarItem>
                    <MenubarItem onClick={() => insertTable({ rows: 4, cols: 4 })}>4 x 4</MenubarItem>
                    <MenubarItem onClick={() => insertTable({ rows: 4, cols: 6 })}>4 x 6</MenubarItem> */}
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className="text-sm font-normal py-0.5 px-2 rounded-sm hover:bg-gray-200 cursor-pointer">Format</MenubarTrigger>
              <MenubarContent>
                <MenubarSub>
                  <MenubarSubTrigger className="cursor-pointer">
                    <Text className="size-4 mr-2 text-black" />
                    Text
                  </MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem className="cursor-pointer" onClick={() => editor?.chain().focus().toggleBold().run()}>
                      <Bold className="size-4 mr-2 text-black" />
                      Bold
                    </MenubarItem>
                    <MenubarItem className="cursor-pointer" onClick={() => editor?.chain().focus().toggleItalic().run()}>
                      <Italic className="size-4 mr-2 text-black" />
                      Italic
                    </MenubarItem>
                    <MenubarItem className="cursor-pointer" onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                      <Underline className="size-4 mr-2 text-black" />
                      Underline
                    </MenubarItem>
                    <MenubarItem className="cursor-pointer" onClick={() => editor?.chain().focus().toggleStrike().run()}>
                      <Strikethrough className="size-4 mr-2 text-black" />
                      Strikethrough
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarItem className="cursor-pointer" onClick={() => editor?.chain().focus().unsetAllMarks().run()}>
                  <RemoveFormatting className="size-4 mr-2 text-black" />
                  Clear formatting
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </nav>
  );
}
