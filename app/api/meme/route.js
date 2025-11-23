import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// Standard Fast Models (Vision capable)
const FAST_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.2-11b-vision-instruct:free",
  "google/gemini-flash-1.5-8b",
];

// Reasoning Model (Vision capable + Chain of Thought)
const REASONING_MODEL = "google/gemini-2.0-flash-thinking-exp:free";

export async function POST(req) {
  try {
    const { image, prompt, useReasoning } = await req.json();

    if (!image) return NextResponse.json({ error: "Image required" }, { status: 400 });

    const imageUrl = image.startsWith("data:") ? image : `data:image/jpeg;base64,${image}`;

    // SELECT STRATEGY
    // If user wants reasoning, try the thinking model first. 
    // If they want fast, or if thinking fails, fall back to the loop.
    let modelList = useReasoning 
      ? [REASONING_MODEL, ...FAST_MODELS] // Try thinking first, then fallback
      : FAST_MODELS; // Fast only

    let lastError = null;

    for (const model of modelList) {
      try {
        console.log(`Using model: ${model} | Reasoning Mode: ${useReasoning}`);

        // Different system prompt for Reasoning models
        // Reasoning models generally handle instructions better if they are in the User prompt
        const isThinkingModel = model.includes("thinking");

        const body = {
          model: model,
          messages: [
            {
              role: "system",
              content: isThinkingModel 
                ? "You are a meme generator." // Simple system for thinking models
                : "Return ONLY a JSON array of strings. Example: [\"text\"]" // Strict for fast models
            },
            {
              role: "user",
              content: [
                { 
                  type: "text", 
                  text: isThinkingModel
                    ? `${prompt || "Generate 5 funny meme captions."} \n\nIMPORTANT: Analyze the image deeply first. Then output ONLY a JSON object with a key 'captions' containing 5 strings.` 
                    : (prompt || "Generate 5 funny meme captions.")
                },
                { type: "image_url", image_url: { url: imageUrl } }
              ]
            }
          ]
        };

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "X-Title": "AI Meme Gen"
          },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          const errText = await res.text();
          // If the experimental thinking model is down/rate-limited, throw to fallback
          throw new Error(`Model ${model} failed: ${res.status} - ${errText}`);
        }

        const result = await res.json();
        const aiText = result?.choices?.[0]?.message?.content || "";

        // === PARSING ===
        // Clean markdown and find the JSON array/object
        const cleanJson = aiText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        let captions = [];
        
        // Attempt 1: Parse standard JSON
        try {
            // Find the first '{' or '['
            const firstBracket = cleanJson.search(/[{[]/);
            const lastBracket = cleanJson.search(/[}\]]$/); // search from end effectively
            
            if (firstBracket !== -1) {
                const substring = cleanJson.substring(firstBracket, cleanJson.lastIndexOf(']') + 1 || cleanJson.lastIndexOf('}') + 1);
                const parsed = JSON.parse(substring);
                
                if (Array.isArray(parsed)) captions = parsed;
                else if (parsed.captions && Array.isArray(parsed.captions)) captions = parsed.captions;
            }
        } catch (e) {
            console.warn("Parsing failed, trying fallback split");
        }

        // Attempt 2: Fallback text split if JSON failed
        if (captions.length === 0) {
            captions = cleanJson.split("\n")
                .map(l => l.replace(/^\d+[\.\)]\s*/, "").replace(/["*]/g, "").trim())
                .filter(l => l.length > 3 && !l.toLowerCase().includes("caption"));
        }

        if (captions.length > 0) {
          return NextResponse.json({ captions: captions.slice(0, 5) });
        }

      } catch (error) {
        console.error(error.message);
        lastError = error;
      }
    }

    throw lastError || new Error("All models failed.");

  } catch (err) {
    return NextResponse.json({ error: "Failed to generate." }, { status: 500 });
  }
}