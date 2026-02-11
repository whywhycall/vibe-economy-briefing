"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!input) return;

    setLoading(true);
    setResult("");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: input }),
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10">
      <h1 className="text-3xl font-bold mb-6">
        Vibe Economy Briefing
      </h1>

      <textarea
        className="w-full max-w-xl p-3 border rounded mb-4"
        rows={5}
        placeholder="프롬프트를 입력하세요..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={generate}
        className="bg-black text-white px-6 py-2 rounded"
      >
        {loading ? "생성 중..." : "Generate"}
      </button>

      {result && (
        <div className="mt-6 w-full max-w-xl p-4 border rounded whitespace-pre-wrap">
          {result}
        </div>
      )}
    </main>
  );
}
