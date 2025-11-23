"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Upload,
  Download,
  Wand2,
  Image as ImageIcon,
  Loader2,
  Trash2,
  BrainCircuit,
  Sun,
  Moon,
  Laptop
} from "lucide-react";

export default function AIMemePage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [isSmartMode, setIsSmartMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiCaptions, setAiCaptions] = useState([]);
  
  const canvasRef = useRef(null);
  const { setTheme } = useTheme();

  // Helper: Compress image
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.7)); 
        };
      };
    });
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setTopText("");
      setBottomText("");
      setAiCaptions([]);
    }
  };

  const handleAiGenerate = async () => {
    if (!file) return;
    setIsGenerating(true);
    setAiCaptions([]);

    try {
      const base64Image = await compressImage(file);
      const res = await fetch("/api/meme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          prompt: "Generate 5 funny meme captions.",
          useReasoning: isSmartMode,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (data.captions) setAiCaptions(data.captions);
      
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current || !previewUrl) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new window.Image();
    img.crossOrigin = "anonymous"; 
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const fontSize = img.width * 0.1;
      ctx.font = `900 ${fontSize}px Impact, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = fontSize * 0.08;
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      
      if (topText) {
        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, fontSize + 10);
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, fontSize + 10);
      }
      if (bottomText) {
        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
      }
      
      const link = document.createElement("a");
      link.download = `meme-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = previewUrl;
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* Minimal Header */}
      <header className="flex items-center justify-between p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
             <span className="text-primary-foreground font-bold">M</span>
           </div>
           <h1 className="text-xl font-bold tracking-tight">MemeStudio</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" /> Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" /> Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Laptop className="mr-2 h-4 w-4" /> System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Controls */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* 1. Upload */}
            {!previewUrl ? (
              <div 
                className="group border-2 border-dashed border-muted-foreground/25 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all"
                onClick={() => document.getElementById('file-upload').click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFileChange(e.dataTransfer.files[0]); }}
              >
                <div className="p-4 bg-muted rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm text-muted-foreground">Click to upload or drag image</p>
                <Input id="file-upload" type="file" className="hidden" onChange={(e) => handleFileChange(e.target.files?.[0])} />
              </div>
            ) : (
              <div className="relative group rounded-xl overflow-hidden border bg-muted/30">
                <div className="absolute top-2 right-2 z-10">
                   <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" onClick={() => { setFile(null); setPreviewUrl(null); }}>
                     <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
                <div className="flex items-center gap-4 p-3">
                   <div className="h-12 w-12 relative rounded-lg overflow-hidden bg-background">
                     <Image src={previewUrl} alt="thumb" fill className="object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">Ready to edit</p>
                   </div>
                </div>
              </div>
            )}

            {/* 2. AI Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <BrainCircuit className={`h-4 w-4 ${isSmartMode ? "text-primary" : "text-muted-foreground"}`} />
                   <Label htmlFor="smart-mode" className="text-sm font-medium cursor-pointer">Deep Thinking</Label>
                </div>
                <Switch id="smart-mode" checked={isSmartMode} onCheckedChange={setIsSmartMode} />
              </div>

              <Button 
                onClick={handleAiGenerate} 
                disabled={!previewUrl || isGenerating} 
                className="w-full h-11 text-sm font-medium rounded-xl"
              >
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                {isGenerating ? "Analyzing..." : "Generate Ideas"}
              </Button>
            </div>

            {/* 3. Inputs */}
            {aiCaptions.length > 0 && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggestions</Label>
                <div className="grid gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {aiCaptions.map((cap, i) => (
                    <button 
                      key={i} 
                      onClick={() => setBottomText(cap)}
                      className="text-left text-sm p-3 rounded-lg border bg-background hover:bg-muted/50 hover:border-primary/50 transition-all"
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4">
               <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Top Text</Label>
                  <Input 
                    value={topText} 
                    onChange={(e) => setTopText(e.target.value)} 
                    placeholder="WHEN YOU..." 
                    className="h-11 font-bold bg-background/50"
                  />
               </div>
               <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Bottom Text</Label>
                  <Textarea 
                    value={bottomText} 
                    onChange={(e) => setBottomText(e.target.value)} 
                    placeholder="Start typing..." 
                    className="min-h-[100px] font-bold bg-background/50 resize-none"
                  />
               </div>
            </div>

            <Button onClick={handleDownload} disabled={!previewUrl} size="lg" className="w-full rounded-xl font-semibold">
              <Download className="mr-2 h-4 w-4" /> Download Meme
            </Button>
          </div>

          {/* RIGHT: Live Preview */}
          <div className="lg:col-span-7 lg:sticky lg:top-8">
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black aspect-square md:aspect-auto md:min-h-[600px] flex items-center justify-center relative border-4 border-muted">
              {!previewUrl ? (
                <div className="text-center text-muted-foreground/50">
                  <ImageIcon className="h-20 w-20 mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-medium">Preview Area</p>
                </div>
              ) : (
                <div className="relative w-full h-full flex flex-col">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={previewUrl} 
                    alt="preview" 
                    className="w-full h-full object-contain bg-black/90"
                  />
                  
                  {/* Text Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
                     <h2 className="text-center w-full break-words leading-[1.1]"
                         style={{ 
                           fontFamily: 'Impact, sans-serif',
                           fontSize: 'clamp(32px, 6vw, 64px)',
                           color: 'white',
                           textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000',
                           WebkitTextStroke: '2px black' 
                         }}>
                       {topText.toUpperCase()}
                     </h2>
                     <h2 className="text-center w-full break-words leading-[1.1]"
                         style={{ 
                           fontFamily: 'Impact, sans-serif',
                           fontSize: 'clamp(32px, 6vw, 64px)',
                           color: 'white',
                           textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000',
                           WebkitTextStroke: '2px black' 
                         }}>
                       {bottomText.toUpperCase()}
                     </h2>
                  </div>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

        </div>
      </main>
    </div>
  );
}