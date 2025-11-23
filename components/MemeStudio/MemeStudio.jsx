"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import MemeUploader from "./MemeUploader";
import MemeTextInput from "./MemeTextInput";
import MemeControls from "./MemeControls";
import MemePreview from "./MemePreview";
// 💥 NEW IMPORT: Import the separated Navbar component
import MemeNavbar from "./MemeNavbar"; 

export default function MemeStudio() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [aiCaptions, setAiCaptions] = useState([]);

  const [topTextStyle, setTopTextStyle] = useState({
    fontSize: 60,
    color: "#FFFFFF",
    textAlign: "center",
  });
  const [bottomTextStyle, setBottomTextStyle] = useState({
    fontSize: 60,
    color: "#FFFFFF",
    textAlign: "center",
  });

  const [isSmartMode, setIsSmartMode] = useState(false);
  const canvasRef = useRef(null);

  const handleFileChange = (newFile) => {
    if (file && previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(newFile);

    if (newFile) {
      setPreviewUrl(URL.createObjectURL(newFile));
      setAiCaptions([]);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleClearImage = () => {
    if (file && previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setTopText("");
    setBottomText("");
    setAiCaptions([]);

    setTopTextStyle({ fontSize: 60, color: "#FFFFFF", textAlign: "center" });
    setBottomTextStyle({
      fontSize: 60,
      color: "#FFFFFF",
      textAlign: "center",
    });
  };

  const handleSwapText = () => {
    setTopText(bottomText);
    setBottomText(topText);
  };

  const resetTextStyles = () => {
    setTopTextStyle({ fontSize: 60, color: "#FFFFFF", textAlign: "center" });
    setBottomTextStyle({
      fontSize: 60,
      color: "#FFFFFF",
      textAlign: "center",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden bg-gradient-to-br from-gray-50 via-background to-gray-100 dark:from-zinc-900 dark:via-background dark:to-zinc-950">
      
      {/* 💥 NEW COMPONENT: Using the separate MemeNavbar */}
      <MemeNavbar />

      {/* MAIN GRID */}
      <div className="max-w-screen-2xl mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[1.2fr_2fr_1.2fr] gap-8 mt-10">
        
        {/* LEFT: Upload + AI Controls */}
        <Card className="shadow-2xl border-primary/20 bg-card/75 backdrop-blur-xl rounded-3xl lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">📤 Image & AI</CardTitle>
            <CardDescription>
              Upload an image and generate smart captions.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold mb-3">Upload Image</h2>
              <MemeUploader
                currentFile={file}
                previewUrl={previewUrl}
                onFileSelect={handleFileChange}
                onClear={handleClearImage}
              />
            </div>

            <div className="pt-4 border-t border-border">
              <h2 className="text-lg font-semibold mb-3">AI Options</h2>
              <MemeControls
                file={file}
                isSmartMode={isSmartMode}
                setSmartMode={setIsSmartMode}
                onCaptionsGenerated={setAiCaptions}
                previewUrl={previewUrl}
                topText={topText}
                bottomText={bottomText}
                canvasRef={canvasRef}
                topTextStyle={topTextStyle}
                bottomTextStyle={bottomTextStyle}
              />
            </div>
          </CardContent>
        </Card>

        {/* CENTER: Preview */}
        <div className="flex flex-col items-center p-4 rounded-3xl bg-card/80 shadow-2xl border border-primary/20 backdrop-blur-2xl">
          <MemePreview
            previewUrl={previewUrl}
            topText={topText}
            bottomText={bottomText}
            canvasRef={canvasRef}
            topTextStyle={topTextStyle}
            bottomTextStyle={bottomTextStyle}
          />

          {!previewUrl && (
            <p className="text-muted-foreground text-lg mt-6 text-center animate-pulse">
              Your meme preview will appear here.
            </p>
          )}
        </div>

        {/* RIGHT: Text Editing */}
        <Card className="shadow-2xl border-primary/20 bg-card/75 backdrop-blur-xl rounded-3xl lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">✍️ Captions & Style</CardTitle>
            <CardDescription>
              Add or edit text for your meme and adjust its appearance.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <MemeTextInput
              topText={topText}
              onTopChange={setTopText}
              bottomText={bottomText}
              onBottomChange={setBottomText}
              aiCaptions={aiCaptions}
              topTextStyle={topTextStyle}
              setTopTextStyle={setTopTextStyle}
              bottomTextStyle={bottomTextStyle}
              setBottomTextStyle={setBottomTextStyle}
              onSwapText={handleSwapText}
              onResetStyles={resetTextStyles}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}