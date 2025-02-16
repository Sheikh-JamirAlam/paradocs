"use client";

import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/app/lib/constants/urls";
import { getSession } from "@/app/server/actions/sessions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ShareDialog({
  documentId,
  isOpen,
  onClose,
  onCollaboratorAdded,
}: {
  documentId: string | string[] | undefined;
  isOpen: boolean;
  onClose: () => void;
  onCollaboratorAdded: () => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"VIEWER" | "EDITOR">("VIEWER");

  const addCollaborator = async () => {
    try {
      const session = await getSession();
      await axios.post(
        `${BACKEND_URL}/documents/${documentId}/collaborators`,
        { email, role },
        {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      );
      onCollaboratorAdded();
      onClose();
      setEmail("");
    } catch (error) {
      console.error("Failed to add collaborator:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Collaborator</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Select value={role} onValueChange={(value: "VIEWER" | "EDITOR") => setRole(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VIEWER">Viewer</SelectItem>
              <SelectItem value="EDITOR">Editor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button onClick={addCollaborator} className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors cursor-pointer">
          Add Collaborator
        </button>
      </DialogContent>
    </Dialog>
  );
}
