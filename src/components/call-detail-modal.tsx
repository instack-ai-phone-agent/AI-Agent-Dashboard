"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, X, ArrowLeft, ArrowRight } from "lucide-react";
import { getCallHistory } from "@/lib/api";

interface CallDetailModalProps {
  open: boolean;
  onClose: () => void;
  callId: string;
}

export default function CallDetailModal({ open, onClose, callId }: CallDetailModalProps) {
  const [callData, setCallData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCall = async () => {
      if (!callId || !open) return;
      setLoading(true);
      try {
        const data = await getCallHistory(callId);
        setCallData(data);
      } catch (err) {
        console.error("Failed to fetch call data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCall();
  }, [callId, open]);

  if (!callData) return null;

  const {
    call_summary,
    sentiment,
    id,
    phone_number,
    highlights = [],
    audio_path,
  } = callData;

  const audioUrl = audio_path ? `https://test.aivocall.com/static/audios/${audio_path}` : "";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <Tabs defaultValue="highlights" className="w-full">
            <TabsList className="flex gap-4">
              <TabsTrigger value="highlights">Highlights</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="highlights" className="w-full">
          <TabsContent value="highlights">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Call Summary</h2>
              <p className="text-sm text-muted-foreground">
                {loading ? "Loading..." : call_summary || "No summary available"}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Call Breakdown</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Phone Number</p>
                  <p className="flex items-center gap-1">
                    <span>{phone_number || "anonymous"}</span>
                    <Copy className="h-4 w-4 cursor-pointer" />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Call ID</p>
                  <p className="flex items-center gap-1">
                    <span>{id}</span>
                    <Copy className="h-4 w-4 cursor-pointer" />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sentiment</p>
                  <p>{sentiment || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Highlights</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {highlights.length > 0 ? (
                      highlights.map((h: any, idx: number) => (
                        <li key={idx}>{h.name}</li>
                      ))
                    ) : (
                      <li>No highlights available</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Call Flow</h2>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="transcript">
            <div className="text-sm text-muted-foreground">
              Transcript of the conversation goes here... (placeholder)
            </div>
          </TabsContent>
        </Tabs>

        {audio_path && (
          <div className="mt-6">
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
