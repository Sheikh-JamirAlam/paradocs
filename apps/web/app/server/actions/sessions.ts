"use server";

import { cookies } from "next/headers";

export const getSession = async (): Promise<string> => {
  const token = (await cookies()).get("token");
  const session = token?.value;
  return session ?? "";
};
