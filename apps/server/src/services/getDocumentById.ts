import prisma from "../config/db";

export const getDocumentById = async (documentId: string, userId: string) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId, ownerId: userId },
      select: { id: true, title: true, content: true },
    });
    if (!document) {
      return { error: "Document does not exist for user" };
    }
    return document;
  } catch (error) {
    throw new Error("Database error: " + error);
  }
};
