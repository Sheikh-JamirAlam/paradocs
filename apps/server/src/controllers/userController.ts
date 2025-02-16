import { NextFunction, Request, Response } from "express";

interface AuthRequest extends Request {
  user?: { id: string; email: string; name: string | null };
}

export const getAuthenticatedUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }
    const { id, email, name } = req.user;

    const response = { id, email, name };

    res.json(response);
  } catch (err) {
    next(err);
  }
};
