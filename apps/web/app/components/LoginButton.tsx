"use client";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";

export default function LoginButton() {
  return <LoginLink className="px-4 py-2 rounded-lg border-2 border-lime-400 hover:bg-lime-400 transition-colors duration-500 cursor-pointer">Login</LoginLink>;
}
