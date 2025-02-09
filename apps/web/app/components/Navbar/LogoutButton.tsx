"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function SignupButton() {
  return <LogoutLink className={`w-fit px-4 py-2 font-semibold rounded-lg text-white bg-lime-500 hover:bg-lime-600 transition-colors duration-500 cursor-pointer`}>Log Out</LogoutLink>;
}
