import jwt from "jsonwebtoken";

const { verify, sign } = jwt;

export const generateToken = (userId: string) => {
  return sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return verify(token, process.env.JWT_SECRET as string);
};
