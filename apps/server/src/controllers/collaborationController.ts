import { Request, Response } from "express";
import { addCollaborator, getCollaborators, removeCollaborator } from "../services/collaborationService";

export const addCollaboratorController = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const { email, role } = req.body;

    const collaboration = await addCollaborator(documentId, email, role);
    res.status(200).json({ collaboration });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getCollaboratorsController = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const collaborators = await getCollaborators(documentId);
    res.status(200).json({ collaborators });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const removeCollaboratorController = async (req: Request, res: Response) => {
  try {
    const { documentId, userId } = req.params;
    await removeCollaborator(documentId, userId);
    res.status(200).json({ message: "Collaborator removed successfully" });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
