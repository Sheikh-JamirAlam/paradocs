import jwt from "jsonwebtoken";

const { verify, sign } = jwt;

export const generateToken = async (userId: string) => {
  return sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyToken = async (token: string) => {
  return verify(token, process.env.JWT_SECRET as string);
};
