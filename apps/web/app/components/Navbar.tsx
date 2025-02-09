"use client";

import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import LoginButton from "./Navbar/LoginButton";
import LogoutButton from "./Navbar/LogoutButton";
import SignupButton from "./Navbar/SignupButton";

export default function Navbar() {
  const { user, isLoading, error } = useAuth();

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  return (
    <section className="w-full px-56 py-4 flex justify-between bg-gray-50 border-b-1 border-gray-300">
      <div className="text-4xl font-semibold font-serif underline">Paradocs</div>
      {user ? (
        <div>
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
