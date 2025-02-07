// import { Request, Response, NextFunction } from "express";
// import { KindeClient } from "@kinde-oss/kinde-auth-node";

// const kinde = new KindeClient({
//   issuer: process.env.KINDE_ISSUER_URL!,
//   clientId: process.env.KINDE_CLIENT_ID!,
//   clientSecret: process.env.KINDE_CLIENT_SECRET!,
// });

// declare global {
//   namespace Express {
//     interface Request {
//       user?: any;
//     }
//   }
// }

// export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
//   try {
//     const user = await kinde.getUser(req);
//     if (!user || !user.id) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }
//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: "Invalid authentication" });
//   }
// }
