"use client";

import { ImageIcon } from "lucide-react";

export default function MemePreview({
  previewUrl,
  topText,
  bottomText,
  canvasRef,
  topTextStyle,
  bottomTextStyle,
}) {
  // fallback styles if props missing
  const safeTop = topTextStyle || { fontSize: 60, color: "#FFFFFF", textAlign: "center" };
  const safeBottom = bottomTextStyle || { fontSize: 60, color: "#FFFFFF", textAlign: "center" };

  const outline = `
      2px 2px 0 #000,
      -2px -2px 0 #000,
      2px -2px 0 #000,
      -2px 2px 0 #000,
      3px 0 0 #000,
      -3px 0 0 #000,
      0 3px 0 #000,
      0 -3px 0 #000
  `;

  const baseTextStyle = {
    fontFamily: "Impact, sans-serif",
    textShadow: outline,
    WebkitTextStroke: "1.5px black",
    letterSpacing: "1px",
    lineHeight: "1.05",
    width: "100%",
    wordWrap: "break-word",
    pointerEvents: "none",
    padding: "0 8px",
  };

  const currentTopTextStyle = {
    ...baseTextStyle,
    fontSize: `${(safeTop.fontSize ?? 60) / 11}vmax`,
    color: safeTop.color ?? "#FFFFFF",
    textAlign: safeTop.textAlign ?? "center",
  };

  const currentBottomTextStyle = {
    ...baseTextStyle,
    fontSize: `${(safeBottom.fontSize ?? 60) / 11}vmax`,
    color: safeBottom.color ?? "#FFFFFF",
    textAlign: safeBottom.textAlign ?? "center",
  };

  return (
    <div className="w-full space-y-3">
      <div
        className="
          relative w-full aspect-square overflow-hidden
          rounded-3xl border bg-black 
          border-border/60 shadow-2xl
          transition-all duration-300
        "
      >
        {!previewUrl ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-10">
            <ImageIcon className="h-20 w-20 mb-4 opacity-40 text-muted-foreground" />
            <p className="text-xl font-bold text-muted-foreground/80">
              Your Meme Will Appear Here
            </p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              Upload an image to begin
            </p>
          </div>
        ) : (
          <div className="relative w-full h-full animate-fadeIn">
            <img
              src={previewUrl}
              alt="meme preview"
              className="w-full h-full object-contain bg-black pointer-events-none select-none"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/25" />

            <div className="absolute inset-0 flex flex-col justify-between py-6 sm:py-8">
              <h2 className="uppercase font-extrabold text-white" style={currentTopTextStyle}>
                {topText}
              </h2>

              <h2 className="uppercase font-extrabold text-white" style={currentBottomTextStyle}>
                {bottomText}
              </h2>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
