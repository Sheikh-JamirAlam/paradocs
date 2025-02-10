"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";
import { BACKEND_URL } from "../../lib/constants/urls";

export default function DocumentEditor() {
  const { document_id } = useParams();
  const [socket, setSocket] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">Document Editor</h1>
      <div className="border p-4 mt-4">
        <EditorContent />
      </div>
      {isSaving && <p className="text-gray-500 mt-2">Saving...</p>}
    </div>
  );
}
