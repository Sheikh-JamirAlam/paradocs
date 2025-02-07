import { Request, Response } from "express";
import { registerUser } from "../services/userService";

interface User {
  kindeId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const signupUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: User = req.body;
    if (!user || !user.kindeId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const dbUser = await registerUser(user);
    res.status(200).json({ message: "User logged in", user: dbUser });
    return;
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
