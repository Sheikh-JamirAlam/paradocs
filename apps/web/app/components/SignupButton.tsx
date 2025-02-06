"use client";

import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

export default function SignupButton({ text, isNavElement }: { text: string; isNavElement?: boolean }) {
  return (
    <RegisterLink className={`w-fit ${isNavElement ? "px-4 py-2" : "px-6 py-4"} font-semibold rounded-lg text-white bg-lime-500 hover:bg-lime-600 transition-colors duration-500 cursor-pointer`}>
      {text}
    </RegisterLink>
  );
}
