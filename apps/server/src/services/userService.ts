import prisma from "../config/db";

interface User {
  kindeId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const registerUser = async (user: User) => {
  try {
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.kindeId,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`.trim(),
        },
      });
    }

    return dbUser;
  } catch (error) {
    throw new Error("Database error: " + error);
  }
};
