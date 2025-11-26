"use client";

import { Lightbulb } from "lucide-react";
import ThemeToggle from "../theme-toggle";

export default function MemeNavbar() {
  return (
    <header
      className="
        sticky top-0 z-30 
        flex justify-between items-center
        py-3 px-6 sm:px-8
        border-b border-border
        bg-card/70 backdrop-blur-xl
        shadow-xl dark:shadow-zinc-900/50
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            h-10 w-10 rounded-xl
            bg-primary/10 flex items-center justify-center
            shadow-inner
          "
        >
          <Lightbulb className="h-6 w-6 text-primary" />
        </div>

        <h1
          className="
            text-xl sm:text-2xl font-extrabold tracking-tight
            text-transparent bg-clip-text
            bg-gradient-to-r from-primary to-purple-500
          "
        >
          AI Meme Studio
        </h1>
      </div>

      <ThemeToggle />
    </header>
  );
}
