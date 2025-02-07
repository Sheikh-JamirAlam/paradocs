import express from "express";
import { signupUser } from "../controllers/authController";
// import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", signupUser);

export default router;
