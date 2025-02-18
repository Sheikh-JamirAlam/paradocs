"use client";

import { EllipsisVerticalIcon } from "lucide-react";

export default function DocumentsTable() {
  return (
    <section className="px-56 py-5">
      <div className="h-10 flex items-center justify-between font-semibold border-b border-gray-200 text-gray-500">
        <div className="w-[40rem]">Name</div>
        <div className="w-[15rem]">Owned by</div>
        <div className="w-[15rem]">Created at</div>
        <div className="w-[5rem]"></div>
      </div>
      <div className="h-14 flex items-center justify-between border-b border-gray-200 text-gray-500">
        <div className="w-[40rem]">Document Name</div>
        <div className="w-[15rem]">User Name</div>
        <div className="w-[15rem]">Created at</div>
        <div className="w-[5rem]">
          <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
            <EllipsisVerticalIcon className="size-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
