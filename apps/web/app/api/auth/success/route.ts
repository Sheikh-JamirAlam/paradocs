import axios from "axios";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user == null || !user.id) throw new Error("Something went wrong with authentication" + user);

  const { data } = await axios.post("http://localhost:8080/auth/signup", { kindeId: user.id, firstName: user.given_name ?? "", lastName: user.family_name ?? "", email: user.email ?? "" });

  if (!data.accessToken) {
    console.error("Access token is missing from the response");
    return NextResponse.redirect(new URL("/", "http://localhost:3000"));
  }

  const response = NextResponse.redirect(new URL("/", "http://localhost:3000"));

  response.cookies.set({
    name: "token",
    value: data.token,
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
  });

  console.log("cookie was set");

  return response;
}
