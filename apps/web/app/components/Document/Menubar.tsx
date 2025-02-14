"use client";

import { CloudDone } from "../Icons";

export default function Menubar() {
  return (
    <section className="w-full px-4 py-2 flex">
      <div className="text-4xl font-semibold font-serif underline">Paradocs</div>
      <div className="flex flex-col">
        <div className="font-medium flex gap-2">
          <input className="w-fit" type="text" value="Document Name" readOnly />
          <CloudDone />
        </div>
      </div>
    </section>
  );
}
