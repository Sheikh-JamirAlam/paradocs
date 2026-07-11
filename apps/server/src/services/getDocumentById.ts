import prisma from "../config/db";

export const getDocumentById = async (documentId: string, userId: string) => {
  try {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        OR: [
          { ownerId: userId },
          {
            collaborators: {
              some: {
                userId,
              },
            },
          },
        ],
      },

      select: {
        id: true,
        title: true,
        content: true,
        ownerId: true,

        collaborators: {
          where: {
            userId,
          },
          select: {
            role: true,
          },
        },
      },
    });

    if (!document) {
      return { error: "Document does not exist for user" };
    }

    const canEdit = document.ownerId === userId || document.collaborators.some((collaborator) => collaborator.role === "EDITOR");

    return {
      id: document.id,
      title: document.title,
      content: document.content,
      canEdit,
    };
  } catch (error) {
    throw new Error("Database error: " + error);
  }
};
