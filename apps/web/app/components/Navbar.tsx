import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";

export default function Navbar() {
  return (
    <section className="w-full px-56 py-4 flex justify-between bg-gray-50 border-b-1 border-gray-300">
      <div className="text-4xl font-semibold font-serif underline">Paradocs</div>
      <div className="flex gap-4 font-medium">
        <LoginButton />
        <SignupButton text="Signup" isNavElement />
      </div>
    </section>
  );
}
