import express from "express";
import { JWTMiddleware } from "../middlewares/authMiddleware";
import { addDocumentController, getDocumentController } from "../controllers/documentController";

const router = express.Router();

router.post("/add", JWTMiddleware, addDocumentController);
router.get("/:documentId", JWTMiddleware, getDocumentController);

export default router;
