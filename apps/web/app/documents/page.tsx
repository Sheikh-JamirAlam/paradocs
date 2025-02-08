"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Home() {
  return (
    <div className="font-sans">
      <main className="">
        <h1>Hello</h1>
        <LogoutLink>Log out</LogoutLink>
      </main>
      <footer className=""></footer>
    </div>
  );
}
