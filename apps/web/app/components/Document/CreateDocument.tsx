"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { getSession } from "@/app/server/actions/sessions";
import { AddCircle } from "@repo/ui/icons";
import { BACKEND_URL } from "@/app/lib/constants/urls";

export default function CreateDocument() {
  const router = useRouter();

  const createDocument = async () => {
    try {
      const session = await getSession();
      const response = await axios.post(
        `${BACKEND_URL}/documents/add`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      );
      router.push(`/documents/${response.data.document.id}`);
    } catch (error) {
      console.error("Failed to create document:", error);
    }
  };

  return (
    <div onClick={createDocument} className="w-48 h-64 bg-white border border-gray-300 rounded-sm flex items-center justify-center text-6xl text-lime-500 cursor-pointer">
      <AddCircle />
    </div>
  );
}
