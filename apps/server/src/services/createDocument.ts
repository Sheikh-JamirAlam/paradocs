import prisma from "../config/db";

export const createDocument = async (id: string) => {
  try {
    const document = await prisma.document.create({
      data: {
        title: "Untitled Document",
        ownerId: id,
        content: "",
      },
    });
    return document;
  } catch (error) {
    throw new Error("Database error: " + error);
  }
};
