import prisma from "../config/db";

export const getDocumentById = async (documentId: string, userId: string) => {
  const document = await prisma.document.findUnique({
    where: { id: documentId, ownerId: userId },
    select: { id: true, title: true, content: true },
  });
  if (!document) {
    throw new Error("Document does not exist for user");
  }
  return document;
};
