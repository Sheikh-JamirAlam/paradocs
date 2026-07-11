"use client";

import NextLink from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/lib/constants/urls";
import { getSession } from "@/app/server/actions/sessions";
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
import MenubarNav from "@/app/components/Document/MenubarNav";
import Toolbar from "@/app/components/Document/Toolbar";
import { FontSize, PreserveSpaces } from "@/app/lib/extensions/tiptap";
import { useAuth } from "@/app/hooks/useAuth";
import Loader from "@/app/components/Document/Loader";
import { debounce } from "lodash";
import { useYjsCollaboration } from "@/app/hooks/useYjsCollaboration";
import { createYjsCollaborationExtension } from "@/app/lib/extensions/yjsCollaboration";

export default function Page() {
  const { documentId } = useParams();
  const { user, isLoading } = useAuth();
  const memoizedUser = useMemo(() => {
    return user ? { id: user.id, name: user.name } : null;
  }, [user]);
  const [document, setDocument] = useState<{ title: string; content: string; canEdit: boolean } | null>(null);
  const [isDocumentAccessible, setIsDocumentAccessible] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const session = await getSession();
        const response = await axios.get(`${BACKEND_URL}/documents/${documentId}`, {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        });
        if (response.data.document.error) {
          setIsDocumentAccessible(false);
        } else setIsDocumentAccessible(true);
        setDocument(response.data.document);
      } catch (error) {
        console.error("Failed to fetch document:", error);
      }
    };

    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);

  const saveContent = async (content: string) => {
    try {
      const session = await getSession();
      await axios.patch(
        `${BACKEND_URL}/documents/${documentId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        },
      );
    } catch (error) {
      console.error("Failed to save document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((content: string) => saveContent(content), 1000),
    [documentId],
  );

  const baseExtensions = useMemo(
    () => [
      StarterKit.configure({ history: false }),
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
      PreserveSpaces,
    ],
    [],
  );

  const collaboration = useYjsCollaboration(typeof documentId === "string" ? documentId : undefined, memoizedUser, isDocumentAccessible);

  const editorExtensions = useMemo(() => {
    if (!collaboration) return baseExtensions;

    return [...baseExtensions, createYjsCollaborationExtension(collaboration.fragment, collaboration.provider.awareness)];
  }, [baseExtensions, collaboration]);

  const editor = useEditor(
    {
      extensions: editorExtensions,
      immediatelyRender: false,
      editable: false,

      editorProps: {
        attributes: {
          style: "padding-left: 51px; padding-right: 51px;",
          class: "focus:outline-none print:boder-0 border bg-white border-gray-300 flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
        },
      },

      onUpdate: ({ editor }) => {
        if (!document?.canEdit) return;
        const newContent = editor.getHTML();
        setIsSaving(true);
        debouncedSave(newContent);
      },
    },
    [collaboration],
  );

  useEffect(() => {
    editor?.setEditable(document?.canEdit ?? false);
  }, [editor, document?.canEdit]);

  if (isLoading || !document) return <Loader />;

  if (!isDocumentAccessible) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Document Not Found</h1>
        <NextLink href="/" className="px-4 py-2 bg-lime-500 hover:bg-lime-700 transition-colors text-white rounded-md cursor-pointer">
          Return Home
        </NextLink>
      </div>
    );
  }

  if (!collaboration) return <Loader />;

  return (
    <div className="h-[100vh] size-full overflow-x-auto bg-gray-100 px-4 print:p-0 print:bg-white print:overflow-visible">
      <div className="px-4 py-1 bg-gray-100 fixed top-0 left-0 right-0 z-10 print:hidden">
        <MenubarNav editor={editor} user={user} title={document?.title || "Untitled Document"} isSaving={isSaving} isViewer={!document?.canEdit} />
        <Toolbar editor={editor} isViewer={!document?.canEdit} />
      </div>
      <div className="min-w-max flex justify-center w-[816px] py-4 pt-32 print:py-0 mx-auto print:w-full print:min-w-0 font-[Arial]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
