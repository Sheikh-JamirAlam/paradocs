import { SpinnerClock } from "../Icons";

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SpinnerClock className="text-gray-500 text-4xl" />
    </div>
  );
}
