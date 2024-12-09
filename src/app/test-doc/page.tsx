"use client";
// `app/dashboard/page.tsx` is the UI for the `/dashboard` URL

import { useEffect, useState } from "react";

import "katex/dist/katex.min.css";
import jsonData from "./data.json";
import ItemContent from "@/app/test-doc/ItemContent";
export default function TestDoc() {
  const [data, setData] = useState<typeof jsonData.data.chatItems>([]);
  async function getData() {
    await fetch("./data.json");
    setData(jsonData.data.chatItems);
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      {data.map((item, idx) => (
        <div key={idx}>
          <ItemContent text={item.content} />
          <div>
            =================================================================================================={" "}
            <br />{" "}
            ==================================================================================================
          </div>
        </div>
      ))}
    </div>
  );
}
