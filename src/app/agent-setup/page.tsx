"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function AgentDesignPage() {
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [voice, setVoice] = useState("voice-1");
  const [tone, setTone] = useState("friendly");

  return (
    <DashboardShell>
      {/* Page Title */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agent Design</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Customize how your AI Agent sounds and handles conversations.
            </p>
          </div>
          <Button variant="default">Test Your Agent</Button>
        </div>
      </div>

      {/* Top Tabs + Guidelines Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <Tabs defaultValue="agent-design" className="w-full space-y-6">
          <TabsList>
            <TabsTrigger value="agent-design">Agent Design</TabsTrigger>
            <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Agent Design Tab Content */}
<TabsContent value="agent-design">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Choose a Voice */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Choose a Voice</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Set a voice that your AI agent will use to answer the phone.
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-2">Choose Voice & Tone</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Choose Voice & Tone</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Select Voice</label>
                        <Select value={voice} onValueChange={setVoice}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a voice" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="voice-1">Voice 1 - Male</SelectItem>
                            <SelectItem value="voice-2">Voice 2 - Female</SelectItem>
                            <SelectItem value="voice-3">Voice 3 - Neutral</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Select Tone</label>
                        <Select value={tone} onValueChange={setTone}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="empathetic">Empathetic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
            </Card>

            {/* Set Agent Guidelines */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Set Agent Guidelines</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Set guidelines to define how the agent should behave.
                  </p>
                </div>
                <Dialog open={guidelinesOpen} onOpenChange={setGuidelinesOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-2">Configure</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>AI Agent Prompt</DialogTitle>
                      <p className="text-sm text-muted-foreground">
                        Write instructions that guide how the AI Agent should respond to customers.
                      </p>
                    </DialogHeader>
                    <textarea
                      rows={10}
                      className="w-full border border-gray-300 rounded-md p-3 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={greeting}
                      onChange={(e) => setGreeting(e.target.value)}
                      placeholder={`e.g.\nYou are the virtual receptionist for 24x7 Direct...`}
                    />
                    <DialogClose asChild>
                      <Button variant="default" className="mt-4 w-full">Close</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </CardHeader>
            </Card>
          </div>

          {/* Call Flows Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Call Flows</h2>
            <div className="border rounded-md p-6 bg-white shadow-sm mb-4 min-h-[200px] text-sm text-gray-500">
              Drag your steps here to build the call workflow.
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Choose from your saved workflows:</p>
              <Button variant="secondary">+ New Workflow</Button>
            </div>
          </section>
        </TabsContent>


          {/* Knowledge Base Tab Content */}
          <TabsContent value="knowledge-base">
            <h2 className="text-xl font-semibold mb-4">Knowledge Base</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Add internal knowledge your AI Agent should know to answer questions accurately.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1">Add a Knowledge Entry</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Our office hours are 9am–5pm, Monday to Friday..."
                  className="w-full border rounded-md p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Button className="mt-2">+ Add to Knowledge Base</Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload a Document</label>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <p className="text-xs text-gray-400 mt-1">Accepted formats: PDF, DOCX, TXT (max 5MB)</p>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2 text-sm">Existing Knowledge Entries</h4>
                <ul className="space-y-2 text-sm text-gray-800">
                  <li className="bg-white p-3 rounded border">Our support team is available from 8am–6pm AEST.</li>
                  <li className="bg-white p-3 rounded border">You can cancel your subscription with 30 days' notice.</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Settings Placeholder */}
          <TabsContent value="settings">
            <p className="text-sm text-gray-500">Settings panel coming soon.</p>
          </TabsContent>
        </Tabs>

      </div>
    </DashboardShell>
  );
}
