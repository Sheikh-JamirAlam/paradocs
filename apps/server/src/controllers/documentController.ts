import { Request, Response } from "express";
import { createDocument } from "../services/createDocument";

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
