"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
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
import { useSearchParams } from "next/navigation";

export default function AgentDesignPage() {
  const searchParams = useSearchParams();
  const agentDesignId = searchParams.get("id") || ""; // Fallback if missing

  const [agentData, setAgentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agentDesignId) return;

    const fetchAgentData = async () => {
      try {
        const response = await fetch("https://test.aivocall.com/agent-designs");
        const data = await response.json();
        const match = data.find((d: any) => d.id === agentDesignId);
        setAgentData(match);
      } catch (error) {
        console.error("Failed to fetch agent design", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentData();
  }, [agentDesignId]);

  const handleUpdate = async () => {
    try {
      const res = await fetch(`https://test.aivocall.com/agent-designs/${agentDesignId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentData),
      });
      if (!res.ok) throw new Error("Failed to update");
      alert("Agent design updated.");
    } catch (err) {
      console.error(err);
    }
  };

  if (!agentDesignId) return <DashboardShell>Missing agent ID.</DashboardShell>;
  if (loading) return <DashboardShell>Loading...</DashboardShell>;
  if (!agentData) return <DashboardShell>Agent design not found.</DashboardShell>;

  const showPhoneReminder = !agentData.phone_number;

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Agent Design</h1>
      </div>

      {showPhoneReminder && (
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded">
          ⚠️ Please add a phone number to use this agent for calling, chatting, or answering.
        </div>
      )}

      <Tabs defaultValue="agent-design" className="w-full space-y-6">
        <TabsList>
          <TabsTrigger value="agent-design">Agent Design</TabsTrigger>
          <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="agent-design">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-500" /> AI Greeting & Voice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                value={agentData.greeting || ""}
                onChange={(e) => setAgentData({ ...agentData, greeting: e.target.value })}
                className="w-full border p-2 rounded-md mb-4"
                placeholder="Agent Greeting"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Voice</label>
                  <Select
                    value={agentData.voice}
                    onValueChange={(val) => setAgentData({ ...agentData, voice: val })}
                  >
                    <SelectTrigger><SelectValue placeholder="Select voice" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="voice-1">Voice 1</SelectItem>
                      <SelectItem value="voice-2">Voice 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Tone</label>
                  <Select
                    value={agentData.tone}
                    onValueChange={(val) => setAgentData({ ...agentData, tone: val })}
                  >
                    <SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-6">
            <Button onClick={handleUpdate}>Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="knowledge-base">
          <p className="text-sm text-gray-500">Coming soon</p>
        </TabsContent>

        <TabsContent value="settings">
          <p className="text-sm text-gray-500">Coming soon</p>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}