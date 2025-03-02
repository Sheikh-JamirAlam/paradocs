"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { EllipsisVerticalIcon, FilePenIcon, SquareArrowOutUpRightIcon, Trash2Icon } from "lucide-react";
import { SpinnerClock } from "@repo/ui/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BACKEND_URL } from "@/app/lib/constants/urls";
import { getSession } from "@/app/server/actions/sessions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  content: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  collaborators: Array<{
    user: {
      id: string;
      name: string;
      email: string;
    };
    role: string;
  }>;
  updatedAt: string;
}

export default function DocumentsTable() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [documentName, setDocumentName] = useState("");

  const fetchDocuments = async () => {
    try {
      const session = await getSession();
      const response = await axios.get(`${BACKEND_URL}/documents/getalluserdocs`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });
      setDocuments(response.data.documents);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const saveDocumentName = async (newTitle: string, documentId: string) => {
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

  const handleRename = (e: React.MouseEvent<HTMLButtonElement>, doc: Document) => {
    e.stopPropagation();
    saveDocumentName(documentName, doc.id);
    setIsRenameOpen(false);
    toast.success("Document name updated");
    fetchDocuments();
  };

  if (isLoading)
    return (
      <div className="h-64 flex justify-center items-center">
        <SpinnerClock className="text-gray-500 text-4xl" />
      </div>
    );

  return (
    <section className="px-56 py-5">
      <div className="h-10 px-2 flex items-center justify-between font-semibold border-b border-gray-200 text-gray-500">
        <div className="w-[40rem]">Name</div>
        <div className="w-[15rem]">Owned by</div>
        <div className="w-[15rem]">Last updated at</div>
        <div className="w-[5rem]"></div>
      </div>
      {documents.map((doc, index) => (
        <div
          key={index}
          onClick={() => (window.location.href = `/documents/${doc.id}`)}
          className={`h-14 px-2 flex items-center justify-between hover:bg-lime-100 cursor-pointer transition-colors ${index === documents.length - 1 ? "border-b-0" : "border-b"} border-gray-200 text-gray-500`}
        >
          <div className="w-[40rem]">{doc.title}</div>
          <div className="w-[15rem]">{doc.owner.name}</div>
          <div className="w-[15rem]">
            {new Date(doc.updatedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="w-[5rem]">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-8 h-8 flex items-center justify-center rounded-full outline-0 hover:bg-gray-200 cursor-pointer transition-colors">
                <EllipsisVerticalIcon className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                  <DialogTrigger className="w-full">
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDocumentName(doc.title);
                        setIsRenameOpen(true);
                      }}
                      className="px-2 py-2 border-b border-gray-200 rounded-b-none cursor-pointer"
                    >
                      <FilePenIcon size={16} className="text-black" />
                      Rename
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                      <DialogTitle>Rename</DialogTitle>
                      <DialogDescription>Please enter a new name for the item:</DialogDescription>
                    </DialogHeader>
                    <div className="my-2">
                      <Input value={documentName} onChange={(e) => setDocumentName(e.target.value)} onClick={(e) => e.stopPropagation()} className="focus-visible:ring-lime-300" />
                    </div>
                    <DialogFooter>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRenameOpen(false);
                        }}
                        className="w-24 py-2 border border-gray-200 hover:border-lime-500 text-lime-500 hover:text-black rounded-md cursor-pointer hover:bg-lime-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={(e) => handleRename(e, doc)}
                        className="w-24 py-2 border border-lime-500 hover:border-lime-600 text-white rounded-md cursor-pointer bg-lime-500 hover:bg-lime-600 transition-colors"
                      >
                        Save
                      </button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <DropdownMenuItem className="px-2 py-2 border-b border-gray-200 rounded-b-none rounded-t-none cursor-pointer">
                  <Trash2Icon size={16} className="text-black" />
                  Remove
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/documents/${doc.id}`, "_blank", "noreferrer");
                  }}
                  className="px-2 py-2 rounded-t-none cursor-pointer"
                >
                  <SquareArrowOutUpRightIcon size={16} className="text-black" />
                  Open in new tab
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </section>
  );
}
