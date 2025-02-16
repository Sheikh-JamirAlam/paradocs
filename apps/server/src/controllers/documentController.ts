import { Request, Response } from "express";
import { createDocument } from "../services/createDocument";
import { getDocumentById } from "../services/getDocumentById";
import { updateDocument } from "../services/updateDocument";

interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string | null };
}

export const addDocumentController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }
    const { id } = req.user;

    const document = await createDocument(id);

    res.status(200).json({ message: "Document was created", document });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDocumentController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }
    const { id } = req.user;
    const { documentId } = req.params;

    const document = await getDocumentById(documentId, id);

    res.status(200).json({ message: "Document was found", document });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateDocumentController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }
    const { id } = req.user;
    const { documentId } = req.params;
    const { content } = req.body;

    const document = await updateDocument(documentId, id, content);
    res.status(200).json({ message: "Document was updated", document });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
