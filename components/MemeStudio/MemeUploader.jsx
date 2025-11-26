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
      {currentFile && previewUrl ? (
        <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden border border-border/40 shadow-lg bg-card/40 backdrop-blur-sm group transition-all duration-200">
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="w-full h-full object-contain bg-muted"
          />

          <Button
            variant="destructive"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            <XCircle className="h-4 w-4" />
          </Button>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`relative w-full h-44 sm:h-52 flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
            ${
              isDragActive
                ? "border-primary bg-primary/10 shadow-md scale-[1.01]"
                : "border-muted-foreground/30 bg-card/30 backdrop-blur-sm hover:border-primary/40"
            }
          `}
        >
          <input {...getInputProps()} />

          <div className={`transition-transform duration-200 ${isDragActive ? "scale-110" : "scale-100"}`}>
            {isDragActive ? (
              <UploadCloud className="h-10 w-10 text-primary animate-pulse" />
            ) : (
              <ImageIcon className="h-9 w-9 text-muted-foreground/70" />
            )}
          </div>

          <p className="mt-2 text-sm font-medium text-foreground">
            {isDragActive ? "Drop the file here!" : "Click or drag & drop an image"}
          </p>

          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
            JPG, PNG, GIF, WEBP supported
          </p>
        </div>
      )}
    </div>
  );
}
