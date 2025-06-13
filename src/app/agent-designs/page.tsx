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
  <h2 className="text-2xl font-semibold mb-1">Knowledge Base</h2>
  <p className="text-sm text-gray-600 mb-6">
    Provide your Instack AI Agent with your company's knowledge so it can answer customers' questions accurately.{" "}
    <a href="#" className="text-indigo-600 hover:underline">Learn more</a>
  </p>

  {/* Inner Tabs: Documents / Websites */}
  <Tabs defaultValue="documents" className="w-full">
    <TabsList className="mb-4">
      <TabsTrigger value="documents">Documents</TabsTrigger>
      <TabsTrigger value="websites">Websites</TabsTrigger>
    </TabsList>

    <TabsContent value="documents">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
    <div className="flex flex-wrap gap-2">
      <Button variant="outline">
        {/* Keep the existing icon setup here if you have it */}
        Upload File
      </Button>
      <Button variant="outline">
        {/* Keep the existing icon setup here if you have it */}
        Blank Document
      </Button>
    </div>
    <div className="flex gap-2 mt-2 md:mt-0">
      <Input placeholder="Filter documents ..." className="w-48" />
      <Select>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Active" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
  {/* Placeholder for documents table – will be built next */}
  <div className="overflow-auto border rounded-md">
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Last Updated By</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Last Updated At</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Usage Mode</th>
          <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
          <th className="px-4 py-2 text-right font-semibold text-gray-700">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {/* Rows will be injected here using map once connected */}
        <tr>
          <td colSpan={6} className="px-4 py-4 text-center text-gray-500">No results.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p className="mt-4 text-sm text-gray-500">0 of 0 row(s) selected.</p>
</TabsContent>

    <TabsContent value="websites">
      {/* This is where we’ll build the Add Website form and websites table */}
      <p className="text-sm text-gray-600 mb-2">Manage your linked websites.</p>
    </TabsContent>
  </Tabs>
</TabsContent>



        <TabsContent value="settings">
          <p className="text-sm text-gray-500">Settings panel coming soon.</p>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
