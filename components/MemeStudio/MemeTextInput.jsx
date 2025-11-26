"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  CornerUpLeft,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Repeat2,
  RotateCcw,
} from "lucide-react";

export default function MemeTextInput({
  topText,
  onTopChange,
  bottomText,
  onBottomChange,
  aiCaptions = [],
  topTextStyle = { fontSize: 60, color: "#fff", textAlign: "center" },
  setTopTextStyle,
  bottomTextStyle = { fontSize: 60, color: "#fff", textAlign: "center" },
  setBottomTextStyle,
  onSwapText,
  onResetStyles,
}) {
  const selectCaption = (caption) => {
    onTopChange(caption.top);
    onBottomChange(caption.bottom);
  };

  const updateTopStyle = (key, val) =>
    setTopTextStyle((prev) => ({ ...(prev || {}), [key]: val }));

  const updateBottomStyle = (key, val) =>
    setBottomTextStyle((prev) => ({ ...(prev || {}), [key]: val }));

  return (
    <div className="space-y-8">
      {aiCaptions.length > 0 && (
        <section className="space-y-3 pb-6 border-b border-border/50">
          <Label className="text-base font-extrabold text-primary tracking-wide">
            ✨ AI Caption Ideas
          </Label>

          <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {aiCaptions.map((caption, i) => (
              <Badge
                key={i}
                variant="outline"
                onClick={() => selectCaption(caption)}
                className="
                  cursor-pointer p-4 rounded-xl border-border/50 
                  hover:bg-primary/10 transition duration-200
                  flex justify-between items-center shadow-md hover:shadow-lg
                "
              >
                <div className="overflow-hidden">
                  <span className="font-semibold block truncate">{caption.top}</span>
                  <span className="text-xs text-muted-foreground truncate">{caption.bottom}</span>
                </div>
                <CornerUpLeft className="h-4 w-4 ml-3 text-primary opacity-70 shrink-0" />
              </Badge>
            ))}
          </div>
        </section>
      )}

      <Card className="bg-transparent border-none shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Edit Your Meme Text</CardTitle>
          <CardDescription className="text-sm">
            Customize top and bottom captions with styling options.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="flex gap-3 justify-end pt-3 border-t border-border/40">
            <Button variant="outline" size="sm" className="rounded-xl border-border/60" onClick={onSwapText}>
              <Repeat2 className="h-4 w-4 mr-2" /> Swap
            </Button>

            <Button variant="outline" size="sm" className="rounded-xl border-border/60" onClick={onResetStyles}>
              <RotateCcw className="h-4 w-4 mr-2" /> Reset Styles
            </Button>
          </div>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-[10px] tracking-widest font-extrabold">TOP</span>
              <Label className="text-base font-extrabold">Text & Style</Label>
            </div>

            <div className="relative">
              <Input
                placeholder="WHEN YOU..."
                value={topText}
                onChange={(e) => onTopChange(e.target.value)}
                className="font-bold uppercase rounded-xl h-11 pr-12 border-border/60 focus:border-primary"
              />

              {topText && (
                <Button variant="ghost" size="sm" onClick={() => onTopChange("")} className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 hover:bg-destructive/10 p-0">
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Font Size <span className="text-primary">({topTextStyle?.fontSize}px)</span></Label>
                <Slider
                  defaultValue={[topTextStyle?.fontSize ?? 60]}
                  max={100}
                  min={20}
                  step={1}
                  onValueChange={(val) => updateTopStyle("fontSize", val[0])}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={topTextStyle?.color ?? "#FFFFFF"}
                    onChange={(e) => updateTopStyle("color", e.target.value)}
                    className="h-10 w-12 p-0 rounded-lg border-2 border-border/60"
                  />
                  <Input
                    type="text"
                    value={topTextStyle?.color ?? "#FFFFFF"}
                    onChange={(e) => updateTopStyle("color", e.target.value)}
                    className="rounded-lg h-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Alignment</Label>
              <ToggleGroup
                type="single"
                value={topTextStyle?.textAlign ?? "center"}
                onValueChange={(val) => val && updateTopStyle("textAlign", val)}
                className="justify-start"
              >
                <ToggleGroupItem value="left" className="rounded-lg"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="center" className="rounded-lg"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="right" className="rounded-lg"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
              </ToggleGroup>
            </div>
          </section>

          <section className="space-y-4 pt-4 border-t border-border/40">
            <div className="flex items-center gap-2">
              <span className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-[10px] tracking-widest font-extrabold">BOTTOM</span>
              <Label className="text-base font-extrabold">Text & Style</Label>
            </div>

            <div className="relative">
              <Input
                placeholder="...FORGET TO COMMIT"
                value={bottomText}
                onChange={(e) => onBottomChange(e.target.value)}
                className="font-bold uppercase rounded-xl h-11 pr-12 border-border/60 focus:border-primary"
              />

              {bottomText && (
                <Button variant="ghost" size="sm" onClick={() => onBottomChange("")} className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 hover:bg-destructive/10 p-0">
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Font Size <span className="text-primary">({bottomTextStyle?.fontSize}px)</span></Label>
                <Slider
                  defaultValue={[bottomTextStyle?.fontSize ?? 60]}
                  max={100}
                  min={20}
                  step={1}
                  onValueChange={(val) => updateBottomStyle("fontSize", val[0])}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={bottomTextStyle?.color ?? "#FFFFFF"}
                    onChange={(e) => updateBottomStyle("color", e.target.value)}
                    className="h-10 w-12 p-0 rounded-lg border-2 border-border/60"
                  />
                  <Input
                    type="text"
                    value={bottomTextStyle?.color ?? "#FFFFFF"}
                    onChange={(e) => updateBottomStyle("color", e.target.value)}
                    className="rounded-lg h-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Alignment</Label>
              <ToggleGroup
                type="single"
                value={bottomTextStyle?.textAlign ?? "center"}
                onValueChange={(val) => val && updateBottomStyle("textAlign", val)}
                className="justify-start"
              >
                <ToggleGroupItem value="left" className="rounded-lg"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="center" className="rounded-lg"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="right" className="rounded-lg"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
              </ToggleGroup>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
