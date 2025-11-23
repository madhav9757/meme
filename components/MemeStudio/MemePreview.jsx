"use client";

import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // optional if you use shadcn utils

export default function MemePreview({
  previewUrl,
  topText,
  bottomText,
  canvasRef,
  topTextStyle,
  bottomTextStyle,
}) {

  // 🎨 IMPROVEMENT 1: Refined base styles for classic meme font look
  const baseTextStyle = {
    fontFamily: "Impact, sans-serif",
    // Black border/outline
    textShadow:
      "3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 4px 0 0 #000, -4px 0 0 #000, 0 4px 0 #000, 0 -4px 0 #000",
    letterSpacing: "1px",
    lineHeight: "1.1",
    // Fallback for some browsers (though TextShadow is usually better)
    WebkitTextStroke: "2px black", 
    width: "100%",
    wordWrap: "break-word",
    pointerEvents: "none",
  };

  const currentTopTextStyle = {
    ...baseTextStyle,
    // Note: Using 'vmax' ensures the text scales relative to the viewport size
    fontSize: `${topTextStyle.fontSize / 10}vmax`, 
    color: topTextStyle.color,
    textAlign: topTextStyle.textAlign,
  };

  const currentBottomTextStyle = {
    ...baseTextStyle,
    fontSize: `${bottomTextStyle.fontSize / 10}vmax`,
    color: bottomTextStyle.color,
    textAlign: bottomTextStyle.textAlign,
  };

  return (
    <div className="w-full space-y-3">
      
      {/* Outer Card Frame */}
      <div
        className="
          relative w-full aspect-square overflow-hidden 
          rounded-3xl border bg-black 
          border-border/60
          shadow-2xl hover:shadow-[0_0_50px_rgba(0,0,0,0.8)]
          transition-all duration-300 
        "
      >
        {/* Empty State */}
        {!previewUrl ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-10">
            <div className="flex flex-col items-center animate-fadeIn">
              <ImageIcon className="h-20 w-20 mb-4 opacity-40 text-muted-foreground" />
              <p className="text-xl font-bold text-muted-foreground/80">
                Your Meme Will Appear Here
              </p>
              <p className="text-sm text-muted-foreground/60 mt-2">
                Upload an image in the controls panel to begin
              </p>
            </div>
          </div>
        ) : (
          /* Preview Container */
          <div
            className="
              relative w-full h-full animate-fadeIn
              transition-transform duration-300 hover:scale-[1.01]
            "
          >
            {/* The Image */}
            <img
              src={previewUrl}
              alt="Meme Preview"
              className="
                w-full h-full object-contain bg-black 
                pointer-events-none select-none
              "
            />

            {/* 🎨 IMPROVEMENT 2: Subtle gradient for improved text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>

            {/* Top & Bottom Text */}
            {/* 🎨 IMPROVEMENT 3: Increased padding for better text margin */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 lg:p-10">
              <h2 className="uppercase font-extrabold text-white text-shadow-black" style={currentTopTextStyle}>
                {topText}
              </h2>
              <h2 className="uppercase font-extrabold text-white text-shadow-black" style={currentBottomTextStyle}>
                {bottomText}
              </h2>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Canvas (for Download Only) */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}