import prisma from "../config/db";

export const getAllDocumentsForUser = async (userId: string) => {
  try {
    const documents = await prisma.document.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            collaborators: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return documents;
  } catch (error) {
    throw new Error("Database error: " + error);
  }
};
