// app/api/meme-ai/route.js
import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Fast + vision-capable models
const FAST_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.2-11b-vision-instruct:free",
  "google/gemini-flash-1.5-8b",
];

// Vision reasoning model
const REASONING_MODEL = "google/gemini-2.0-flash-thinking-exp:free";

export async function POST(req) {
  try {
    const { image, prompt, useReasoning, fileType } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Correct image MIME type
    const mimeType = fileType || "image/jpeg";
    const imageUrl = image.startsWith("data:")
      ? image
      : `data:${mimeType};base64,${image}`;

    // Model strategy
    const modelList = useReasoning
      ? [REASONING_MODEL, ...FAST_MODELS]
      : FAST_MODELS;

    let lastError = null;

    // Try each model
    for (const model of modelList) {
      try {
        console.log(`Trying model: ${model}`);

        const isThinkingModel = model.includes("thinking");

        const systemPrompt = isThinkingModel
          ? "You are a meme generator. Respond ONLY with valid JSON."
          : 'Output ONLY a JSON array. Example: [{"top":"text","bottom":"text"}]';

        const userPrompt = `
          ${prompt || "Generate 5 funny meme captions."}
          Each caption MUST include: { "top": "...", "bottom": "..." }
          Return ONLY JSON. No extra text.
        `.trim();

        const body = {
          model,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                { type: "text", text: userPrompt },
                { type: "image_url", image_url: { url: imageUrl } },
              ],
            },
          ],
        };

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer":
              process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "X-Title": "AI Meme Studio",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          throw new Error(`Model failed: ${model} → ${res.status}`);
        }

        const result = await res.json();
        const aiRaw = result?.choices?.[0]?.message?.content?.trim() || "";

        // Remove backticks if model wraps JSON
        const clean = aiRaw.replace(/```json|```/g, "").trim();

        // Extract only the JSON array
        const start = clean.indexOf("[");
        const end = clean.lastIndexOf("]");

        if (start === -1 || end === -1) throw new Error("No JSON found");

        const extracted = clean.substring(start, end + 1);

        let parsed = JSON.parse(extracted);

        if (!Array.isArray(parsed)) throw new Error("JSON is not an array");

        // Validate items
        const captions = parsed
          .filter(
            (item) =>
              item &&
              typeof item.top === "string" &&
              typeof item.bottom === "string"
          )
          .slice(0, 5);

        if (captions.length > 0) {
          return NextResponse.json({ captions });
        }
      } catch (err) {
        lastError = err;
        console.warn(`Model failed: ${model}`, err.message);
      }
    }

    throw lastError || new Error("All models failed");

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "AI caption generation failed" },
      { status: 500 }
    );
  }
}
