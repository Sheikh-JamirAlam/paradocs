import prisma from "../config/db";

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: { id: true, email: true, name: true },
  });
  if (!user) {
    throw new Error("User does not exist");
  }
  return user;
};
