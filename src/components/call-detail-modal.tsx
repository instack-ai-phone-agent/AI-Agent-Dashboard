"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, X, ArrowLeft, ArrowRight } from "lucide-react";

interface CallDetailModalProps {
  open: boolean;
  onClose: () => void;
  callId: string;
}

export default function CallDetailModal({ open, onClose, callId }: CallDetailModalProps) {
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
                Nikki Ramsey inquired about getting a virtual assistant to set up a lead capture form on her Linktree. She provided her name and phone number but declined to share her email, expressing concerns about data privacy.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Call Breakdown</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Phone Number</p>
                  <p className="flex items-center gap-1">
                    <span>anonymous</span>
                    <Copy className="h-4 w-4 cursor-pointer" />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Call ID</p>
                  <p className="flex items-center gap-1">
                    <span>{callId}</span>
                    <Copy className="h-4 w-4 cursor-pointer" />
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Highlights</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Nikki wants VA for Linktree lead capture</li>
                    <li>Provided name and phone number</li>
                    <li>Reluctant to provide email</li>
                    <li>Request for confirmation of help</li>
                    <li>Wants lead form before link clicks</li>
                    <li>Details will be passed to team</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Call Flow</h2>
              <p className="text-sm text-muted-foreground">
                Data capture workflow &rarr; Base Agent
              </p>
            </div>
          </TabsContent>

          <TabsContent value="transcript">
            <div className="text-sm text-muted-foreground">
              Transcript of the conversation goes here... (mock data)
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <audio controls className="w-full">
            <source src="/mock-call.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </DialogContent>
    </Dialog>
  );
}
