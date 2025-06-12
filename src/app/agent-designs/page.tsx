"use client";

import { useState, useEffect } from "react";
import DashboardShell from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AgentGuidelinesPopup from "@/components/agent-guidelines-popup";
import { getAgentGuidelines } from "@/lib/api";
import NumberDialog from "@/components/NumberDialog";
import { Info, Mic, Palette } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getAgentDesigns, updateAgentDesign } from "@/lib/api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function AgentDesignPage() {
  const [guidelinesPrompt, setGuidelinesPrompt] = useState("");
  const [voice, setVoice] = useState<string | null>(null);
  const [tone, setTone] = useState<string | null>(null);
  const [aiGreeting, setAiGreeting] = useState("");
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);
  const [agentDesignId, setAgentDesignId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const agentId = searchParams.get("id");

  useEffect(() => {
  const fetchAgentDesign = async () => {
    if (!agentId) return;
    const designs = await getAgentDesigns();
    const design = designs.find((d: any) => String(d.voice_agent_id) === String(agentId));
    if (design) {
      setVoice(design.voice);
      setTone(design.tone);
      setAiGreeting(design.ai_greeting || "");
      setAgentDesignId(design.id);

      // Fetch guidelines from separate API
      const fetchedGuidelines = await getAgentGuidelines(agentId);
      if (fetchedGuidelines && typeof fetchedGuidelines === "string") {
        setGuidelinesPrompt(fetchedGuidelines);
      }
    }
  };

  fetchAgentDesign();
}, [agentId]);

  useEffect(() => {
    const autosave = setTimeout(() => {
      if (agentDesignId) {
        updateAgentDesign(agentDesignId.toString(), {
          ai_greeting: aiGreeting,
          voice: voice ?? "",
          tone: tone ?? "",
          guidelines: guidelinesPrompt,
        });
      }
    }, 1000);
    return () => clearTimeout(autosave);
  }, [aiGreeting, voice, tone, guidelinesPrompt, agentDesignId]);

  return (
    <DashboardShell>
      {!hasPhoneNumber && (
        <div
          role="alert"
          className="relative w-full rounded-lg border border-purple-300 bg-purple-50 p-0 mb-4"
        >
          <div className="text-sm flex h-full flex-row items-center justify-between gap-2 p-2 text-pink-700">
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-1" />
              You don't have a number assigned to this agent. Get a number to start calling.
            </div>
            <NumberDialog />
          </div>
        </div>
      )}

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

      <Tabs defaultValue="agent-design" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="agent-design">Agent Design</TabsTrigger>
          <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="agent-design">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
            {/* AI Greeting & Voice (60%) */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>AI Greeting & Voice</CardTitle>
                <p className="text-sm text-muted-foreground mb-4">
                  Define how your agent starts conversations and sounds.
                </p>
                <div className="space-y-4 mt-1">
                  {/* Greeting Input */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <label className="text-sm font-medium whitespace-nowrap">Set Greeting</label>
                    <Input
                      className="w-full sm:flex-1"
                      value={aiGreeting}
                      onChange={(e) => setAiGreeting(e.target.value)}
                      placeholder="Hi, how can I help you today?"
                    />
                  </div>

                  {/* Voice & Tone */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium whitespace-nowrap">Select a Voice</label>
                      <Select value={voice || ""} onValueChange={setVoice}>
                        <SelectTrigger className="rounded-md border px-3">
                          <Mic className="w-4 h-4 mr-1" />
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="voice-1">Male</SelectItem>
                          <SelectItem value="voice-2">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium whitespace-nowrap">Select a Tone</label>
                      <Select value={tone || ""} onValueChange={setTone}>
                        <SelectTrigger className="rounded-md border px-3">
                          <Palette className="w-4 h-4 mr-1" />
                          <SelectValue placeholder="Select" />
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
                </div>
              </CardHeader>
            </Card>

            {/* Set Agent Guidelines (40%) */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Set Agent Guidelines</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Set guidelines to define how the agent should behave.
                </p>
                <div className="mt-2">
                  <AgentGuidelinesPopup
                    value={guidelinesPrompt}
                    onChange={(val) => setGuidelinesPrompt(val)}
                    onSave={() => {
                      if (agentDesignId) {
                        updateAgentDesign(agentDesignId.toString(), {
                          ai_greeting: aiGreeting,
                          voice: voice ?? "",
                          tone: tone ?? "",
                          guidelines: guidelinesPrompt,
                        });
                      }
                    }}
                  />
                </div>
              </CardHeader>
            </Card>
          </div>


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

        <TabsContent value="settings">
          <p className="text-sm text-gray-500">Settings panel coming soon.</p>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
