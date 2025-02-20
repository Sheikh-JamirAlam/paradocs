"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/lib/constants/urls";
import { getSession } from "@/app/server/actions/sessions";
import { EllipsisVerticalIcon } from "lucide-react";
import Loader from "./Loader";

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

  useEffect(() => {
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

    fetchDocuments();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <section className="px-56 py-5">
      <div className="h-10 flex items-center justify-between font-semibold border-b border-gray-200 text-gray-500">
        <div className="w-[40rem]">Name</div>
        <div className="w-[15rem]">Owned by</div>
        <div className="w-[15rem]">Created at</div>
        <div className="w-[5rem]"></div>
      </div>
      {documents.map((doc) => (
        <div key={doc.id} className="h-14 flex items-center justify-between border-b border-gray-200 text-gray-500">
          <div className="w-[40rem]">{doc.title}</div>
          <div className="w-[15rem]">{doc.owner.name}</div>
          <div className="w-[15rem]">{new Date(doc.updatedAt).toLocaleDateString()}</div>
          <div className="w-[5rem]">
            <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
              <EllipsisVerticalIcon className="size-5" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
