"use client";

import { useRef, useEffect, useState } from "react";
import { CloudDone } from "../Icons";

export default function Menubar() {
  const [docName, setDocName] = useState("Document Name");
  const [inputWidth, setInputWidth] = useState(108);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current) {
      const width = spanRef.current.offsetWidth;
      setInputWidth(width);
    }
  }, [docName]);

  return (
    <section className="w-full px-4 py-2 flex gap-2">
      <div className="text-4xl font-semibold font-serif underline">Paradocs</div>
      <div className="flex flex-col">
        <div className="font-medium flex items-center gap-1">
          <span ref={spanRef} className="px-2 invisible absolute whitespace-pre" aria-hidden="true">
            {docName}
          </span>
          <input className="w-fit px-2" onChange={(e) => setDocName(e.target.value)} type="text" value={docName} style={{ width: `${inputWidth}px` }} />
          <CloudDone />
        </div>
      </div>
    </section>
  );
}
