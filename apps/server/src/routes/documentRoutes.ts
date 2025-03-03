import express from "express";
import { JWTMiddleware } from "../middlewares/authMiddleware";
import {
  addDocumentController,
  deleteDocumentController,
  getAllDocumentsController,
  getDocumentController,
  updateDocumentController,
  updateDocumentNameController,
} from "../controllers/documentController";
import { addCollaboratorController, getCollaboratorsController, removeCollaboratorController } from "../controllers/collaborationController";

const router = express.Router();

router.post("/add", JWTMiddleware, addDocumentController);
router.get("/getalluserdocs", JWTMiddleware, getAllDocumentsController);
router.get("/:documentId", JWTMiddleware, getDocumentController);
router.patch("/:documentId", JWTMiddleware, updateDocumentController);
router.patch("/:documentId/title", JWTMiddleware, updateDocumentNameController);
router.delete("/:documentId/delete", JWTMiddleware, deleteDocumentController);

router.post("/:documentId/collaborators", JWTMiddleware, addCollaboratorController);
router.get("/:documentId/collaborators", JWTMiddleware, getCollaboratorsController);
router.delete("/:documentId/collaborators/:userId", JWTMiddleware, removeCollaboratorController);

export default router;
