"use client";

import useSocket from "./SocketHook";

export default function TextSpace() {
  const { content, updateContent } = useSocket();

  return (
    <div className="w-full py-52 px-96">
      <textarea value={content} onChange={(event) => updateContent(event.target.value)} name="textspace" id="textspace" rows={10} className="w-full p-4 bg-gray-300" placeholder="Type Here" />
    </div>
  );
}
