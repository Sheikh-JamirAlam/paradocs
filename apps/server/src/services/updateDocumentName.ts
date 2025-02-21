import prisma from "../config/db";

export const updateDocumentName = async (documentId: string, userId: string, title: string) => {
  try {
    const document = await prisma.document.update({
      where: {
        id: documentId,
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
      data: { title: title },
    });
    return document;
  } catch (error) {
    throw new Error("Failed to update document: " + error);
  }
};
