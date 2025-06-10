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
}

export default function AgentGuidelinesPopup({ value, onChange }: AgentGuidelinesPopupProps) {
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
            <span>You (editor)</span>
            <span>Last updated at Jun 10, 2025, 11:20:09 AM</span>
          </div>
        </DialogHeader>
        <textarea
          rows={12}
          className="w-full border border-gray-300 rounded-md p-3 text-sm font-mono resize-y bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter text or type '/' for commands"
        />
        <DialogClose asChild>
          <Button variant="default" className="mt-4 w-full">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
