import jwt from "jsonwebtoken";

const { verify, sign } = jwt;

interface JwtPayloadWithId extends jwt.JwtPayload {
  id: string;
}

export const generateToken = async (userId: string) => {
  return sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyToken = async (token: string) => {
  return verify(token, process.env.JWT_SECRET as string) as JwtPayloadWithId;
};
