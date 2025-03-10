"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { debounce } from "lodash";
import { Editor } from "@tiptap/react";
import { Document, Packer, Paragraph } from "docx";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "@/components/ui/menubar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Text, File, FilePlus, Printer, Redo2, Undo2, Bold, Strikethrough, Italic, Underline, RemoveFormatting, Image, UploadIcon, SearchIcon, Table, Users, RefreshCcw } from "lucide-react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { CloudDone, FiletypeDocx, FiletypeHtml, FiletypePdf, FiletypeTxt } from "@repo/ui/icons";
import { getSession } from "@/app/server/actions/sessions";
import ShareDialog from "./ShareDialog";
import { BACKEND_URL } from "@/app/lib/constants/urls";

interface UserProps {
  id: string;
  kindeId: string;
  name: string;
  email: string;
}

export default function MenubarNav({ editor, user, title, isSaving }: { editor: Editor | null; user: UserProps | null; title: string; isSaving: boolean }) {
  const { documentId } = useParams();
  const [docName, setDocName] = useState(title);
  const [inputWidth, setInputWidth] = useState(108);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);
  const [isImageUrlDialogOpen, setIsImageUrlDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const spanRef = useRef<HTMLSpanElement>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  useEffect(() => {
    setDocName(title);
  }, [title]);

  useEffect(() => {
    if (spanRef.current) {
      const width = spanRef.current.offsetWidth;
      setInputWidth(width);
    }
  }, [docName]);

  const saveDocumentName = async (newTitle: string) => {
    try {
      const session = await getSession();
      await axios.patch(
        `${BACKEND_URL}/documents/${documentId}/title`,
        { title: newTitle },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to save document title:", error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((newTitle: string) => saveDocumentName(newTitle), 1000),
    [documentId]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setDocName(newTitle);
    debouncedSave(newTitle);
  };

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

  return (
    <nav className="w-full px-4 pb-2 flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Link href="/" className="text-4xl font-semibold font-serif underline">
          Paradocs
        </Link>
        <div className="flex flex-col">
          <div className="font-medium flex items-center gap-1">
            <span ref={spanRef} className="px-2 text-lg invisible absolute whitespace-pre" aria-hidden="true">
              {docName}
            </span>
            <input className="w-fit px-2 text-lg" onChange={handleTitleChange} type="text" value={docName} style={{ width: `${inputWidth}px` }} />
            {isSaving ? (
              <span className="flex items-center gap-2 text-gray-500 text-sm">
                <RefreshCcw className="size-4" />
                Saving...
              </span>
            ) : (
              <CloudDone className="text-lg" />
            )}
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
      <div className="flex gap-2 items-center">
        <div onClick={() => setIsShareDialogOpen(true)} className="px-6 py-2 font-medium bg-lime-200 hover:bg-lime-300 transition-colors rounded-full flex items-center gap-2 cursor-pointer">
          <Users className="size-4" />
          Share
        </div>
        <ShareDialog documentId={documentId} isOpen={isShareDialogOpen} onClose={() => setIsShareDialogOpen(false)} onCollaboratorAdded={() => {}} />
        <Popover>
          <PopoverTrigger className="rounded-full border-4 border-transparent hover:border-gray-200 transition-all outline-none cursor-pointer">
            <div className="w-8 h-8 text-lg font-medium bg-green-500 text-white rounded-full flex items-center justify-center">{`${user?.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}`}</div>
          </PopoverTrigger>
          <PopoverContent className="w-24 p-1 -translate-x-4">
            <div className="grid">
              <div className="px-2 py-1 hover:bg-gray-100 rounded-sm cursor-pointer">
                <LogoutLink>Log out</LogoutLink>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
