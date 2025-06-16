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
import { Settings } from "lucide-react";

interface AgentGuidelinesPopupProps {
  value: string;
  onChange: (val: string) => void;
  onSave?: () => void; // optional save callback
  updatedBy?: string; // optional updated by info
  updatedAt?: string; // optional updated at info
}

export default function AgentGuidelinesPopup({ value, onChange, onSave, updatedBy, updatedAt, }: AgentGuidelinesPopupProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-2 flex items-center gap-2">
          <Settings className="w-4 h-4" /> Configure
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-base font-semibold">Guidelines</DialogTitle>
          <div className="text-xs text-muted-foreground flex flex-col gap-1">
            <span>{updatedBy ?? "Unknown"} (editor)</span>
            <span>Last updated at {updatedAt ? new Date(updatedAt).toLocaleString() : "unknown"}</span>
          </div>
        </DialogHeader>
        <textarea
          name="guidelines"
          id="guidelines"
          rows={12}
          className="w-full border border-gray-300 rounded-md p-3 text-sm font-mono resize-y bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter text or type '/' for commands"
        />
        <DialogClose asChild>
        <Button
          variant="default"
          className="mt-4 w-full"
          onClick={() => {
            if (typeof onSave === "function") {
              onSave(); // trigger save
            }
          }}
        >
          Save Guideline
        </Button>
      </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
