import express from "express";
import { JWTMiddleware } from "../middlewares/authMiddleware";
import { addDocumentController, getDocumentController, updateDocumentController } from "../controllers/documentController";

const router = express.Router();

router.post("/add", JWTMiddleware, addDocumentController);
router.get("/:documentId", JWTMiddleware, getDocumentController);
router.patch("/:documentId", JWTMiddleware, updateDocumentController);

export default router;
