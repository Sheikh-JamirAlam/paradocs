import prisma from "../config/db";

export const addCollaborator = async (documentId: string, email: string, role: "VIEWER" | "EDITOR") => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.collaboration.create({
    data: {
      documentId,
      userId: user.id,
      role,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
};

export const getCollaborators = async (documentId: string) => {
  return prisma.collaboration.findMany({
    where: { documentId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
};

export const removeCollaborator = async (documentId: string, userId: string) => {
  return prisma.collaboration.delete({
    where: {
      userId_documentId: {
        userId,
        documentId,
      },
    },
  });
};
