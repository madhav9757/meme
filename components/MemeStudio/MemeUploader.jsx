"use client";

import { useDropzone } from "react-dropzone";
import { UploadCloud, Image as ImageIcon, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MemeUploader({
  currentFile,
  previewUrl,
  onFileSelect,
  onClear,
}) {
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".gif", ".webp"],
    },
    multiple: false,
  });

  return (
    <div className="w-full">
      {/* If Image Uploaded */}
      {currentFile && previewUrl ? (
        // 🎨 IMPROVEMENT 1: Refined preview frame with shadow and strong rounding
        <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-border/60 shadow-xl bg-card/50 backdrop-blur-md group transition-all duration-300">
          <img
            src={previewUrl}
            alt="Uploaded preview"
            // 🎨 IMPROVEMENT 2: Consistent object-contain for visual clarity
            className="w-full h-full object-contain bg-muted"
          />

          {/* Remove Button */}
          <Button
            variant="destructive"
            size="icon"
            // 🎨 IMPROVEMENT 3: Larger, more visible close button
            className="absolute top-4 right-4 h-9 w-9 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            <XCircle className="h-5 w-5" />
          </Button>

          {/* Glass overlay hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
        </div>
      ) : (
        /* No Image — Dropzone */
        // 🎨 IMPROVEMENT 4: Dynamic styling for drag activation
        <div
          {...getRootProps()}
          className={`relative w-full h-56 sm:h-64 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
            ${
              isDragActive
                ? "border-primary bg-primary/10 shadow-lg scale-[1.01]"
                : "border-muted-foreground/40 bg-card/40 backdrop-blur-sm hover:border-primary/50"
            }
          `}
        >
          <input {...getInputProps()} />

          <div
            className={`transition-transform duration-300 ${
              isDragActive ? "scale-110" : "scale-100"
            }`}
          >
            {isDragActive ? (
              // 🎨 IMPROVEMENT 5: Prominent bounce animation for drop cue
              <UploadCloud className="h-12 w-12 text-primary animate-bounce" />
            ) : (
              <ImageIcon className="h-10 w-10 text-muted-foreground opacity-70" />
            )}
          </div>

          <p className="mt-3 text-lg font-semibold text-foreground">
            {isDragActive ? "Drop the file here!" : "Click or drag & drop an image"}
          </p>

          <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, GIF, WEBP supported</p>
        </div>
      )}
    </div>
  );
}