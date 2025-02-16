import express from "express";
import { JWTMiddleware } from "../middlewares/authMiddleware";
import { addDocumentController } from "../controllers/documentController";

const router = express.Router();

router.post("/add", JWTMiddleware, addDocumentController);

export default router;
