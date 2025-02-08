import { Request, Response } from "express";
import { verifyToken } from "../utils/jwt.service";

export const checkUserVerificationController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { authorization: header } = req.headers;

    if (!header || !header.startsWith("Bearer ")) {
      res.status(401).json({ message: "Authorization token missing or invalid", isValidUser: false });
      return;
    }

    const token = header.split(" ")[1];

    const payload = await verifyToken(token);
    if (!payload) {
      res.status(401).json({ isValidUser: false });
      return;
    }
    res.status(200).json({ isValidUser: true });
  } catch (error) {
    res.status(401).json({ error: "Authorization token could not be verified" });
  }
};
