"use client";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="font-sans">
      <main className="">
        <Navbar />
        <LogoutLink>Log out</LogoutLink>
      </main>
      <footer className=""></footer>
    </div>
  );
}
