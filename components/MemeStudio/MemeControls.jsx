"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Wand2,
  Download,
  Loader2,
  BrainCircuit,
} from "lucide-react";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function MemeControls({
  file,
  isSmartMode,
  setSmartMode,
  onCaptionsGenerated,
  previewUrl,
  topText,
  bottomText,
  canvasRef,
  topTextStyle,
  bottomTextStyle,
}) {
  const [loading, setLoading] = useState(false);

  /* -------------------------------------- */
  /*  AI Caption Generator                  */
  /* -------------------------------------- */
  const handleGenerate = async () => {
    if (!file) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);
    onCaptionsGenerated([]);

    try {
      const base64 = await toBase64(file);

      const res = await fetch("/api/meme-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64.split(",")[1],
          fileType: file.type,
          prompt: "Generate 5 funny meme captions.",
          useReasoning: isSmartMode,
        }),
      });

      const data = await res.json();
      if (data.captions) {
        onCaptionsGenerated(data.captions);
      } else {
        alert(`AI Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while generating captions.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------------- */
  /*  Download Meme                         */
  /* -------------------------------------- */
  const handleDownload = () => {
    if (!previewUrl) {
      alert("Upload an image first!");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = previewUrl;

    img.onload = () => {
      const ctx = canvas.getContext("2d");

      const aspectRatio = img.width / img.height;
      const maxWidth = 800;
      const maxHeight = 800;
      let canvasWidth = img.width;
      let canvasHeight = img.height;

      if (canvasWidth > maxWidth) {
        canvasWidth = maxWidth;
        canvasHeight = canvasWidth / aspectRatio;
      }
      if (canvasHeight > maxHeight) {
        canvasHeight = maxHeight;
        canvasWidth = canvasHeight * aspectRatio;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const margin = canvas.width * 0.03;
      const outline = canvas.width * 0.008;

      const drawStyledText = (text, style, isTop) => {
        if (!text) return;

        const scaledSize = style.fontSize * (canvas.width / 800);
        // 🎨 Note: The impact font needs to be available in the browser/canvas environment
        ctx.font = `${scaledSize}px Impact`; 
        ctx.fillStyle = style.color;
        ctx.strokeStyle = "black";
        ctx.lineWidth = outline;

        ctx.textAlign = style.textAlign;
        ctx.textBaseline = isTop ? "top" : "bottom";

        const x =
          style.textAlign === "left"
            ? margin
            : style.textAlign === "right"
            ? canvas.width - margin
            : canvas.width / 2;

        const y = isTop ? margin : canvas.height - margin;

        // Draw outline then fill for classic meme effect
        ctx.strokeText(text.toUpperCase(), x, y);
        ctx.fillText(text.toUpperCase(), x, y);
      };

      drawStyledText(topText, topTextStyle, true);
      drawStyledText(bottomText, bottomTextStyle, false);

      const link = document.createElement("a");
      link.download = "my-ai-meme.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  return (
    <div className="space-y-6">

      {/* SMART MODE CARD */}
      {/* 🎨 IMPROVEMENT 1: Subtle hover, stronger border, and shadow-inner for depth */}
      <div className="p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-md shadow-inner flex items-center justify-between hover:border-primary/50 transition-all duration-300">

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <BrainCircuit
              className={`h-5 w-5 ${
                isSmartMode ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </div>

          <div>
            {/* 🎨 IMPROVEMENT 2: Use strong font for readability */}
            <Label className="font-semibold text-base">Smart Mode</Label>
            <p className="text-xs text-muted-foreground">
              Slower but generates smarter captions.
            </p>
          </div>
        </div>

        <Switch checked={isSmartMode} onCheckedChange={setSmartMode} />
      </div>

      {/* BUTTON ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* AI BUTTON: Primary action with a distinct gradient */}
        <Button
          onClick={handleGenerate}
          disabled={loading || !file}
          className="
            w-full rounded-xl h-12 text-lg font-bold
            shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 
            transition-all duration-300 
            bg-gradient-to-r from-primary to-purple-500 text-white
            disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none
          "
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Generate Captions
            </>
          )}
        </Button>

        {/* DOWNLOAD BUTTON: Secondary action with a refined outline */}
        <Button
          onClick={handleDownload}
          disabled={!previewUrl}
          className="
            w-full rounded-xl h-12 text-lg font-bold
            shadow-md hover:shadow-lg transition-all duration-300 
            border border-border/60 hover:border-primary/50
          "
          variant="outline"
        >
          <Download className="mr-2 h-5 w-5" />
          Download Meme
        </Button>
      </div>
    </div>
  );
}