import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";
import { BACKEND_URL } from "./app/lib/constants/urls";

async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await axios.get(`${BACKEND_URL}/auth/user-verification`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data;
    return data.isValidUser;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication, can be updated later
  const publicPaths = ["/", "login", "register"];

  if (publicPaths.includes(path)) {
    // If the user has a token and trying to access a public route
    if (token) {
      const isValidToken = await verifyToken(token);
      if (isValidToken && path === "/") {
        return NextResponse.redirect(new URL("/documents", request.url));
      }
    }
    return NextResponse.next();
  }

  // For protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isValidToken = await verifyToken(token);
  if (!isValidToken) {
    const response = NextResponse.redirect(new URL("/", request.url));
    return response;
  }

  // Token is valid, continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
