"use client";

import { useAuth } from "../hooks/useAuth";
import LoginButton from "./Navbar/LoginButton";
import LogoutButton from "./Navbar/LogoutButton";
import SignupButton from "./Navbar/SignupButton";

export default function Navbar() {
  const { user, isLoading } = useAuth();

  return (
    <section className="w-full px-56 py-4 flex justify-between bg-gray-50 border-b-1 border-gray-300">
      <div className="text-4xl font-semibold font-serif underline">Paradocs</div>
      {isLoading ? (
        <div></div>
      ) : user ? (
        <div className="flex font-medium">
          <LogoutButton />
        </div>
      ) : (
        <div className="flex gap-4 font-medium">
          <LoginButton />
          <SignupButton text="Signup" isNavElement />
        </div>
      )}
    </section>
  );
}
