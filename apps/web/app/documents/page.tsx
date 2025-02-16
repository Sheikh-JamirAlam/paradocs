import Navbar from "../components/Navbar";
import CreateDocument from "../components/Document/CreateDocument";

export default function Page() {
  return (
    <div className="font-sans">
      <main className="">
        <Navbar />
        <section className="px-56 py-10">
          <h2 className="ml-2">Add a new document</h2>
          <div className="mt-4 flex items-center">
            <CreateDocument />
          </div>
        </section>
      </main>
      <footer className=""></footer>
    </div>
  );
}
