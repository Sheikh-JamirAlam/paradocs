import axios from "axios";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user == null || !user.id) throw new Error("Something went wrong with authentication" + user);

  await axios.post("http://localhost:8080/auth/signup", { kindeId: user.id, firstName: user.given_name ?? "", lastName: user.family_name ?? "", email: user.email ?? "" });

  return NextResponse.redirect("http://localhost:3000");
}
