import prisma from "../config/db";

export const getDocumentById = async (id: string) => {
  const document = await prisma.document.findUnique({
    where: { id: id },
    select: { id: true, title: true, content: true },
  });
  if (!document) {
    throw new Error("Document does not exist");
  }
  return document;
};
