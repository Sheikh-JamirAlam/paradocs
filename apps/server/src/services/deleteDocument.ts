import prisma from "../config/db";

export const deleteDocument = async (documentId: string, id: string) => {
  try {
    const document = await prisma.document.delete({
      where: {
        id: documentId,
        ownerId: id,
      },
    });
    return document;
  } catch (error) {
    throw new Error("Database error: " + error);
  }
};
