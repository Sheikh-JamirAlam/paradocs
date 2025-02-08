import { NextFunction, Request, Response } from "express";

interface AuthRequest extends Request {
  user?: any;
}

export const getAuthenticatedUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id, email, name } = req.user;

    const response = { id, email, name };

    res.json(response);
  } catch (err) {
    next(err);
  }
};
