// app/api/meme-ai/route.js

import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// --- OpenRouter Model Definitions ---
// Standard Fast Models (Vision capable)
const FAST_MODELS = [
  "google/gemini-2.0-flash-exp:free",
  "meta-llama/llama-3.2-11b-vision-instruct:free",
  "google/gemini-flash-1.5-8b",
];

// Reasoning Model (Vision capable + Chain of Thought)
const REASONING_MODEL = "google/gemini-2.0-flash-thinking-exp:free";
// -----------------------------------


export async function POST(req) {
  try {
    // Destructure the new 'fileType' property from the client request
    const { image, prompt, useReasoning, fileType } = await req.json();

    if (!image) return NextResponse.json({ error: "Image required" }, { status: 400 });

    // Use the provided MIME type to correctly format the Data URI
    // If fileType is missing (e.g., older client call), default to JPEG
    const mimeType = fileType || 'image/jpeg';
    const imageUrl = image.startsWith("data:") 
       ? image 
       : `data:${mimeType};base64,${image}`; 

    // SELECT STRATEGY
    let modelList = useReasoning 
      ? [REASONING_MODEL, ...FAST_MODELS] // Try thinking first, then fallback
      : FAST_MODELS; // Fast only

    let lastError = null;

    for (const model of modelList) {
      try {
        console.log(`Attempting model: ${model} | Reasoning Mode: ${useReasoning}`);

        const isThinkingModel = model.includes("thinking");

        // --- INSTRUCTIONS FOR STRUCTURED OUTPUT ---
        const userPrompt = `
          ${prompt || "Generate 5 funny meme captions."} 
          For each caption, suggest text for the top and bottom of the image.
          
          **IMPORTANT:** Output ONLY a JSON array of objects.
          Example format: [
            {"top": "Top text idea 1", "bottom": "Bottom text idea 1"},
            {"top": "Top text idea 2", "bottom": "Bottom text idea 2"}
          ]
        `.trim();
        
        const systemPrompt = isThinkingModel 
            ? "You are a meme generator that responds with structured JSON. Be creative and concise." 
            : "Return ONLY a JSON array of objects with 'top' and 'bottom' keys. Example: [{\"top\": \"text\", \"bottom\": \"text\"}]"; 
        // ---------------------------------------------


        const body = {
          model: model,
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: [
                { type: "text", text: userPrompt },
                { type: "image_url", image_url: { url: imageUrl } } // Image data is passed here
              ]
            }
          ]
        };

        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            // Ensure this environment variable is set in your .env.local file
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "X-Title": "AI Meme Gen"
          },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Model ${model} failed: ${res.status} - ${errText}`);
        }

        const result = await res.json();
        const aiText = result?.choices?.[0]?.message?.content || "";

        // === STRUCTURED JSON PARSING ===
        const cleanJson = aiText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        let structuredCaptions = [];
        
        try {
            // Safely extract the JSON array from the text
            const startIndex = cleanJson.indexOf('[');
            const endIndex = cleanJson.lastIndexOf(']');
            
            if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                const jsonString = cleanJson.substring(startIndex, endIndex + 1);
                const parsedArray = JSON.parse(jsonString);
                
                // Validate structure before returning
                if (Array.isArray(parsedArray)) {
                    structuredCaptions = parsedArray
                        .filter(item => item && typeof item.top === 'string' && typeof item.bottom === 'string')
                        .map(item => ({ top: item.top, bottom: item.bottom }));
                }
            }
        } catch (e) {
            console.warn(`Structured JSON parsing failed for model ${model}. Raw output: ${aiText.substring(0, 100)}...`, e.message);
        }

        if (structuredCaptions.length > 0) {
          // Success: Send back structured captions to the client
          return NextResponse.json({ captions: structuredCaptions.slice(0, 5) });
        }

      } catch (error) {
        // Store error and try the next fallback model
        console.error(error.message);
        lastError = error;
      }
    }

    // If the loop finishes without success, throw an error
    throw lastError || new Error("All models failed or returned unparsable content.");

  } catch (err) {
    // Catch-all for API route failure (including network issues, key issues, or parsing failures)
    console.error("API Route Error:", err);
    return NextResponse.json({ error: "Failed to generate captions. Please try again." }, { status: 500 });
  }
}