import { NextResponse } from "next/server";

export async function POST(req) {
  const { text } = await req.json();

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "My App",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemma-3-27b-it:free",
      messages: [
        { role: "user", content: text }
      ]
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
