import { NextResponse } from "next/server";
import { FRONTEND_URL } from "../../../lib/constants/urls";
import { KINDE_ISSUER } from "@/app/lib/constants/kindeUrls";

export async function GET() {
  const response = NextResponse.redirect(`${KINDE_ISSUER}/logout?post_logout_redirect_uri=${FRONTEND_URL}`);

  response.cookies.delete("token");

  return response;
}
