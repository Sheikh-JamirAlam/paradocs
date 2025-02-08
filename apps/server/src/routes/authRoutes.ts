import express from "express";
import { signupUser } from "../controllers/authController";
import { checkUserVerificationController, JWTMiddleware } from "../middlewares/authMiddleware";
import { getAuthenticatedUser } from "../controllers/userController";

const router = express.Router();

router.post("/signup", signupUser);
router.get("/user-verification", checkUserVerificationController);
router.get("/me", JWTMiddleware, getAuthenticatedUser);

export default router;
