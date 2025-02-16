"use client";

import { useRef, useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import { Document, Packer, Paragraph } from "docx";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Text, File, FilePlus, Printer, Redo2, Undo2, Bold, Strikethrough, Italic, Underline, RemoveFormatting, Image, UploadIcon, SearchIcon, Table } from "lucide-react";
import { CloudDone, FiletypeDocx, FiletypeHtml, FiletypePdf, FiletypeTxt } from "../Icons";
import { useAuth } from "@/app/hooks/useAuth";

interface ToolbarProps {
  editor: Editor | null;
}

export default function MenubarNav({ editor }: ToolbarProps) {
  const { user, isLoading } = useAuth();
  const [docName, setDocName] = useState("Document Name");
  const [inputWidth, setInputWidth] = useState(108);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);
  const [isImageUrlDialogOpen, setIsImageUrlDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      const width = spanRef.current.offsetWidth;
      setInputWidth(width);
    }
  }, [docName]);

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const anchorElement = document.createElement("a");
    anchorElement.href = url;
    anchorElement.download = filename;
    anchorElement.click();
    URL.revokeObjectURL(url);
  };

  const saveAsDocx = () => {
    if (!editor) return;
    const content = editor.getText();
    const doc = new Document({
      sections: [
        {
          children: [new Paragraph(content)],
        },
      ],
    });
    Packer.toBlob(doc).then((blob) => downloadFile(blob, "document.docx"));
  };

  const saveAsHtml = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], { type: "text/html" });
    downloadFile(blob, `${docName || "document"}.html`);
  };

  const saveAsTxt = () => {
    if (!editor) return;
    const content = editor.getText();
    const blob = new Blob([content], { type: "text/plain" });
    downloadFile(blob, `${docName || "document"}.txt`);
  };

  const createTable = () => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows, cols }).run();
    setIsTableDialogOpen(false);
  };

  const onChange = (src: string) => {
    editor?.chain().focus().setImage({ src }).run();
  };

  const uploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);
      }
    };
    input.click();
  };

  const handleUrlSubmit = () => {
    if (imageUrl) {
      onChange(imageUrl);
      setImageUrl("");
      setIsImageUrlDialogOpen(false);
    }
  };

  if (isLoading) return <div></div>;

  return (
    <nav className="w-full px-4 py-2 flex justify-between items-center">
      <div className="flex gap-2 items-center">
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
                      <MenubarItem className="cursor-pointer" onClick={saveAsDocx}>
                        <FiletypeDocx className="size-4 mr-2 text-black" />
                        DOCX
                      </MenubarItem>
                      <MenubarItem className="cursor-pointer" onClick={saveAsHtml}>
                        <FiletypeHtml className="size-4 mr-2 text-black" />
                        HTML
                      </MenubarItem>
                      <MenubarItem className="cursor-pointer" onClick={() => window.print()}>
                        <FiletypePdf className="size-4 mr-2 text-black" />
                        PDF
                      </MenubarItem>
                      <MenubarItem className="cursor-pointer" onClick={saveAsTxt}>
                        <FiletypeTxt className="size-4 mr-2 text-black" />
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
                      <Image className="size-4 mr-2" /> Image
                    </MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem className="cursor-pointer" onClick={uploadImage}>
                        <UploadIcon size={16} className="text-black" />
                        Upload from computer
                      </MenubarItem>
                      <MenubarItem className="cursor-pointer" onClick={() => setIsImageUrlDialogOpen(true)}>
                        <SearchIcon size={16} className="text-black" />
                        Image url from web
                      </MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarItem className="cursor-pointer" onClick={() => setIsTableDialogOpen(true)}>
                    <Table className="size-4 mr-2 text-black" />
                    Table
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Insert table</DialogTitle>
                  </DialogHeader>
                  <Label htmlFor="rows">Rows</Label>
                  <Input
                    id="rows"
                    placeholder="Rows"
                    type="number"
                    value={rows}
                    onChange={(e) => setRows(parseInt(e.target.value) || 0)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        createTable();
                      }
                    }}
                  />
                  <Label htmlFor="cols">Columns</Label>
                  <Input
                    id="cols"
                    placeholder="Columns"
                    type="number"
                    value={cols}
                    onChange={(e) => setCols(parseInt(e.target.value) || 0)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        createTable();
                      }
                    }}
                  />
                  <DialogFooter>
                    <button onClick={createTable} className="px-4 py-1 bg-transparent hover:bg-lime-200 transition-colors font-medium cursor-pointer rounded-full">
                      Insert
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={isImageUrlDialogOpen} onOpenChange={setIsImageUrlDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Insert image URL</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Insert image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUrlSubmit();
                      }
                    }}
                  />
                  <DialogFooter>
                    <button onClick={handleUrlSubmit} className="px-4 py-1 bg-transparent hover:bg-lime-200 transition-colors font-medium cursor-pointer rounded-full">
                      Insert
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full border-4 border-transparent hover:border-gray-200 transition-all outline-none cursor-pointer">
            <div className="w-8 h-8 text-lg font-medium bg-green-500 text-white rounded-full flex items-center justify-center">{`${user?.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}`}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
