import prisma from "../config/db";

export const updateDocument = async (documentId: string, userId: string, content: string) => {
  try {
    const document = await prisma.document.update({
      where: {
        id: documentId,
        ownerId: userId,
      },
      data: { content },
    });
    return document;
  } catch (error) {
    throw new Error("Failed to update document: " + error);
  }
};
