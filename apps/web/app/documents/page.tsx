import Navbar from "../components/Navbar";
import { AddCircle } from "@repo/ui/icons";

export default function Home() {
  return (
    <div className="font-sans">
      <main className="">
        <Navbar />
        <section className="px-56 py-10">
          <h2 className="ml-2">Add a new document</h2>
          <div className="mt-4 flex items-center">
            <div className="w-48 h-64 bg-white border border-gray-300 rounded-sm flex items-center justify-center text-6xl text-lime-500 cursor-pointer">
              <AddCircle />
            </div>
          </div>
        </section>
      </main>
      <footer className=""></footer>
    </div>
  );
}
