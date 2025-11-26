"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
// Assuming these child components exist and are functional
import MemeUploader from "./MemeUploader"; 
import MemeTextInput from "./MemeTextInput";
import MemeControls from "./MemeControls";
import MemePreview from "./MemePreview";
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
    // REVISION 1: Enhanced background for better visual depth
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <MemeNavbar />

      {/* REVISION 2: Improved Main Grid Layout (responsive, better proportions) */}
      <div className="w-full h-[calc(100vh-68px)] max-w-screen-xl mx-auto p-4 md:p-6 lg:grid lg:grid-cols-[300px_1fr_330px] lg:gap-8 flex flex-col lg:flex-row mt-0">
        
        {/* LEFT PANEL */}
        <div className="hidden lg:block h-full overflow-y-auto pr-2 pb-6">
          {/* REVISION 3: More subtle card styling for a clean look */}
          <Card className="shadow-2xl border-2 border-border/50 bg-card/70 backdrop-blur-md rounded-xl sticky top-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-extrabold text-primary flex items-center gap-2">
                <span role="img" aria-label="upload">📤</span> Image & AI
              </CardTitle>
              <CardDescription className="text-sm">
                Upload an image and generate smart captions.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <h2 className="text-base font-semibold mb-2 text-muted-foreground">Image Source</h2>
                <MemeUploader
                  currentFile={file}
                  previewUrl={previewUrl}
                  onFileSelect={handleFileChange}
                  onClear={handleClearImage}
                />
              </div>

              <div className="pt-4 border-t border-border/70">
                <h2 className="text-base font-semibold mb-2 text-muted-foreground">AI Generator</h2>
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
        </div>

        {/* CENTER PREVIEW (Main Focus) */}
        <div className="lg:h-full flex items-center justify-center py-4 lg:py-0 w-full flex-shrink-0">
          {/* REVISION 4: Preview Container with stronger focus styling */}
          <div className="w-full max-w-[640px] aspect-square rounded-2xl bg-gray-50/10 dark:bg-zinc-900/40 shadow-2xl shadow-primary/20 border-4 border-primary/20 p-4 relative flex items-center justify-center overflow-hidden">
            <MemePreview
              previewUrl={previewUrl}
              topText={topText}
              bottomText={bottomText}
              canvasRef={canvasRef}
              topTextStyle={topTextStyle}
              bottomTextStyle={bottomTextStyle}
            />

            {!previewUrl && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-card/95 backdrop-blur-sm">
                <svg
                  className="w-16 h-16 text-primary/50 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <p className="text-xl font-medium text-muted-foreground text-center">
                  Start by Uploading an Image
                </p>
                <p className="text-sm text-muted-foreground/80 mt-1">
                  Use the panel on the left to select your meme template.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL (Editor Controls) */}
        <div className="lg:h-full overflow-y-auto pl-2 pb-6 flex-shrink-0 w-full lg:w-auto">
          {/* REVISION 3: More subtle card styling for a clean look */}
          <Card className="shadow-2xl border-2 border-border/50 bg-card/70 backdrop-blur-md rounded-xl sticky top-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-extrabold text-primary flex items-center gap-2">
                <span role="img" aria-label="write">✍️</span> Captions & Style
              </CardTitle>
              <CardDescription className="text-sm">
                Add or edit text and adjust its appearance.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
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
        
        {/* Mobile/Tablet Fallback for Left Panel: Display at the top */}
        <div className="lg:hidden w-full order-first">
            {/* Same card content but outside the main grid for mobile flow */}
            <Card className="shadow-lg border-2 border-border/50 bg-card/80 backdrop-blur-sm rounded-xl mb-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                    <span role="img" aria-label="upload">📤</span> Image & AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <MemeUploader
                        currentFile={file}
                        previewUrl={previewUrl}
                        onFileSelect={handleFileChange}
                        onClear={handleClearImage}
                    />
                    <div className="pt-3 border-t border-border/50">
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
        </div>

      </div>
    </div>
  );
}