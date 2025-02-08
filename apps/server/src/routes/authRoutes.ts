import express from "express";
import { signupUser } from "../controllers/authController";
import { checkUserVerificationController } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", signupUser);
router.get("/user-verification", checkUserVerificationController);

export default router;
