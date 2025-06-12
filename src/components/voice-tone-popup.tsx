"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Volume2, Palette } from "lucide-react";

interface VoiceTonePopupProps {
  currentVoice: string | null;
  currentTone: string | null;
  onVoiceChange: (value: string) => void;
  onToneChange: (value: string) => void;
}

const VOICES = [
  { label: "Male", value: "voice-1" },
  { label: "Female", value: "voice-2" },
  { label: "Neutral", value: "voice-3" },
];

const TONES = ["Friendly", "Formal", "Casual", "Empathetic"];

export default function VoiceTonePopup({
  currentVoice,
  currentTone,
  onVoiceChange,
  onToneChange,
}: VoiceTonePopupProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-2 flex items-center gap-2">
          Configure Voice & Tone
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Voice & Tone</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Volume2 className="h-4 w-4" /> Voice
            </h4>
            <div className="flex flex-wrap gap-2">
              {VOICES.map((v) => (
                <Button
                  key={v.value}
                  variant={currentVoice === v.value ? "default" : "outline"}
                  onClick={() => onVoiceChange(v.value)}
                >
                  {v.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Palette className="h-4 w-4" /> Tone
            </h4>
            <div className="flex flex-wrap gap-2">
              {TONES.map((tone) => (
                <Button
                  key={tone}
                  variant={currentTone === tone.toLowerCase() ? "default" : "outline"}
                  onClick={() => onToneChange(tone.toLowerCase())}
                >
                  {tone}
                </Button>
              ))}
            </div>
          </div>

          <div className="pt-4 text-right">
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
