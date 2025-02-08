import { NextResponse } from "next/server";
import { FRONTEND_URL } from "../../../lib/constants/urls";

export async function GET() {
  const response = NextResponse.redirect(new URL("/", FRONTEND_URL));

  response.cookies.delete("token");

  console.log("cookie was deleted");

  return response;
}
