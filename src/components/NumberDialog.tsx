"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";

export default function NumberDialog() {
  const [showNumberDialog, setShowNumberDialog] = useState(false);
  const [importSource, setImportSource] = useState<string | null>(null);

  return (
    <Dialog open={showNumberDialog} onOpenChange={setShowNumberDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2">
          Get a Number
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Assign Number</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="new-number" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="new-number">New Number</TabsTrigger>
            <TabsTrigger value="import-number">Import Number</TabsTrigger>
          </TabsList>

          <TabsContent value="new-number">
            <div className="text-sm text-gray-500 bg-yellow-100 p-3 rounded-md border border-yellow-300">
              This feature is coming soon.
            </div>
          </TabsContent>

          <TabsContent value="import-number">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Import from</label>
                <Select onValueChange={(value) => setImportSource(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="vonage">Vonage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+61..."
                  className="w-full border rounded-md p-2 text-sm"
                />
              </div>

              {importSource === "twilio" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Twilio Account SID</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Twilio Auth Token</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 text-sm"
                    />
                  </div>
                </>
              )}

              {importSource === "vonage" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Vonage API Key</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Vonage API Secret</label>
                    <input
                      type="text"
                      className="w-full border rounded-md p-2 text-sm"
                    />
                  </div>
                </>
              )}

              <Button className="w-full mt-2">Import Number</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
