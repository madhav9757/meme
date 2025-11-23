"use client";

import { Lightbulb } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function MemeNavbar() {
  return (
    // 🎨 IMPROVEMENT: Reduced vertical padding from py-4 to py-3
    <header className="flex justify-between items-center py-3 px-8 border-b border-border sticky top-0 z-30 bg-card/70 backdrop-blur-xl shadow-2xl dark:shadow-zinc-950/50">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Lightbulb className="h-6 w-6 text-primary" />
        </div>
        {/* Gradient Title Text */}
        <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
          AI Meme Studio
        </h1>
      </div>

      <ThemeToggle />
    </header>
  );
}