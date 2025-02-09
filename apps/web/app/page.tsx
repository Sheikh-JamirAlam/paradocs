import Navbar from "./components/Navbar";
import SignupButton from "./components/Navbar/SignupButton";

export default function Home() {
  return (
    <div className="font-sans">
      <main className="">
        <Navbar />
        <section className="px-[25rem] py-20">
          <div className="flex justify-between items-center">
            <div className="w-[30rem] flex flex-col gap-6">
              <h2 className="text-4xl font-semibold font-serif underline">Paradocs</h2>
              <h1 className="text-5xl font-semibold">Easily Collaborate On Your Documents</h1>
              <p>Sit back and let your friend finish all your documents for you. Yeah, that&apos;s Collaboration.</p>
              <SignupButton text="Get Started" />
            </div>
            <div className="w-[40%] h-[23rem] bg-gray-200">Picture here</div>
          </div>
        </section>
      </main>
      <footer className=""></footer>
    </div>
  );
}
