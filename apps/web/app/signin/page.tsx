"use client";

import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

export default function SigninPage() {
  return (
    <main className="h-screen">
      <RegisterLink>Signup</RegisterLink>
    </main>
  );
}
