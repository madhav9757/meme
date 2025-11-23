"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function AIDemo() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    setLoading(true);

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setResult(data?.choices?.[0]?.message?.content || "No response");
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Theme Toggle */}
        <Button
          variant="outline"
          className="flex items-center gap-2 ml-auto"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {/* FIX: Only render icons after mounted */}
          {mounted &&
            (theme === "light" ? <Moon size={16} /> : <Sun size={16} />)}
          Toggle Theme
        </Button>

        {/* Card */}
        <Card>
          <CardHeader>
            <CardTitle>Simple AI Chat (OpenRouter)</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Input
              placeholder="Ask something..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <Button onClick={askAI} disabled={loading}>
              {loading ? "Thinking..." : "Ask AI"}
            </Button>

            {result && (
              <div className="p-3 bg-muted rounded-lg">
                <p>{result}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
