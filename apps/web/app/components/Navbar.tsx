export default function Navbar() {
  return (
    <section className="w-full px-56 py-4 flex justify-between bg-gray-50 border-b-1 border-gray-300">
      <div className="text-4xl font-semibold font-serif">Paradocs</div>
      <div className="flex gap-4 font-medium">
        <div className="px-4 py-2 rounded-lg border-2 border-lime-400 hover:bg-lime-400 transition-colors duration-500 cursor-pointer">Login</div>
        <div className="px-4 py-2 rounded-lg text-white bg-lime-500 hover:bg-lime-600 transition-colors duration-500 cursor-pointer">Signup</div>
      </div>
    </section>
  );
}
