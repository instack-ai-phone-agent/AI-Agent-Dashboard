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
import { getAgentGuidelines, getAgentDesigns, updateAgentDesign, getDataSources, createDataSource, updateDataSource, deleteDataSource, BASE_URL } from "@/lib/api";
import NumberDialog from "@/components/NumberDialog";
import { Info, Mic, Palette, UploadCloud, FilePlus, Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AgentDesignPage() {
  const [guidelinesPrompt, setGuidelinesPrompt] = useState("");
  const [voice, setVoice] = useState<string | null>(null);
  const [tone, setTone] = useState<string | null>(null);
  const [aiGreeting, setAiGreeting] = useState("");
  const [hasPhoneNumber, setHasPhoneNumber] = useState(false);
  const [agentDesignId, setAgentDesignId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const agentId = searchParams.get("id");
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const refreshDataSources = async () => {
    const all = await getDataSources();
    const filtered = all.filter((s: any) => String(s.voice_agent_id) === String(agentId));
    setDataSources(filtered);
  };

  const [websiteName, setWebsiteName] = useState("");
const [websiteURL, setWebsiteURL] = useState("");
const [addWebsiteOpen, setAddWebsiteOpen] = useState(false);

const handleAddWebsite = async () => {
  if (!agentId) return;

  try {
    await createDataSource({
      name: websiteName,
      website: websiteURL,
      voice_agent_id: parseInt(agentId),
    });

    toast.success("Website added successfully");
    setWebsiteName("");
    setWebsiteURL("");
    setAddWebsiteOpen(false);
    refreshDataSources();
  } catch (error) {
    console.error(error);
    toast.error("Failed to add website");
  }
};


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

      const fetchedGuidelines = await getAgentGuidelines(agentId);
      if (fetchedGuidelines && typeof fetchedGuidelines === "string") {
        setGuidelinesPrompt(fetchedGuidelines);
      }

      const sources = await getDataSources();
      const filtered = sources.filter((s: any) => String(s.voice_agent_id) === String(agentId));
      setDataSources(filtered);
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

  const confirmDelete = (id: number) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const handleConfirmedDelete = async () => {
    if (deletingId !== null) {
      const success = await deleteDataSource(deletingId);
      if (success) {
        toast.success("Deleted successfully");
        refreshDataSources();
      } else {
        toast.error("Failed to delete");
      }
      setConfirmOpen(false);
    }
  };

  const handleNameChange = (id: number, name: string) => {
    setDataSources((prev) =>
      prev.map((ds) => (ds.id === id ? { ...ds, name } : ds))
    );
  };

  const handleUpdate = async (id: number) => {
    const doc = dataSources.find((d) => d.id === id);
    if (doc) {
      const res = await updateDataSource(id, { name: doc.name || "", text: doc.text || "" });
      res ? toast.success("Updated successfully") : toast.error("Update failed");
      refreshDataSources();
    }
  };

const [newDocLoading, setNewDocLoading] = useState(false);

const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !agentId) return;

  try {
    const form = new FormData();
    form.append("file", file);
    form.append("voice_agent_id", agentId);
    form.append("name", file.name);

    await fetch(`${BASE_URL}/data_sources`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
      },
      body: form,
    });

    toast.success("File uploaded successfully");
    refreshDataSources();
  } catch (error) {
    console.error("Upload failed:", error);
    toast.error("Failed to upload file");
  } finally {
    e.target.value = ""; // Reset file input
  }
};

const createBlankDoc = async () => {
  if (!agentId) return;
  setNewDocLoading(true);
  try {
    await createDataSource({
      name: "Untitled Document",
      text: "",
      voice_agent_id: parseInt(agentId),
    });
    toast.success("Blank document created");
    refreshDataSources();
  } catch (error) {
    console.error(error);
    toast.error("Failed to create document");
  } finally {
    setNewDocLoading(false);
  }
};


  function toggleActive(id: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <DashboardShell>
      {!hasPhoneNumber && (
        <div className="relative w-full rounded-lg border border-purple-300 bg-purple-50 p-0 mb-4">
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
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>AI Greeting & Voice</CardTitle>
                <p className="text-sm text-muted-foreground mb-4">
                  Define how your agent starts conversations and sounds.
                </p>
                <div className="space-y-4 mt-1">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <label className="text-sm font-medium whitespace-nowrap">Set Greeting</label>
                    <Input
                      className="w-full sm:flex-1"
                      value={aiGreeting}
                      onChange={(e) => setAiGreeting(e.target.value)}
                      placeholder="Hi, how can I help you today?"
                    />
                  </div>

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
              <Button variant="outline" asChild>
  <label className="flex items-center gap-2 cursor-pointer">
    <UploadCloud className="w-4 h-4" />
    Upload File
    <input
      type="file"
      accept=".pdf,.docx,.txt"
      className="hidden"
      onChange={handleUpload}
    />
  </label>
</Button>

<Button variant="outline" onClick={createBlankDoc} disabled={newDocLoading}>
  <FilePlus className="w-4 h-4 mr-1" />
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
                {dataSources.filter(ds => !ds.website).map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-2">
                  <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={entry.name}
                    onChange={(e) => handleNameChange(entry.id, e.target.value)}
                    onBlur={() => handleUpdate(entry.id)}
                  />
                </td>
                <td className="px-4 py-2">You</td>
                <td className="px-4 py-2">{new Date(entry.updated_at).toLocaleString()}</td>
                <td className="px-4 py-2">Automatic</td>
                <td className="px-4 py-2">{entry.active ? "Active" : "Inactive"}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleActive(entry.id)}>
                      {entry.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => confirmDelete(entry.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-500">0 of 0 row(s) selected.</p>
        </TabsContent>

            <TabsContent value="websites">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex flex-wrap gap-2">
                  <Dialog open={addWebsiteOpen} onOpenChange={setAddWebsiteOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Globe className="w-4 h-4 mr-1" />
                  Add Website
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Website</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
                      placeholder="e.g. FAQ Page"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Website URL</label>
                    <Input
                      value={websiteURL}
                      onChange={(e) => setWebsiteURL(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAddWebsiteOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddWebsite}>Add</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Input placeholder="Filter websites ..." className="w-48" />
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

              <div className="overflow-auto border rounded-md">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">URL</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Last Updated By</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Last Updated At</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Usage Mode</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dataSources.filter(ds => ds.website).map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-2">
                  <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={entry.name}
                    onChange={(e) => handleNameChange(entry.id, e.target.value)}
                    onBlur={() => handleUpdate(entry.id)}
                  />
                </td>
                <td className="px-4 py-2">{entry.website}</td>
                <td className="px-4 py-2">You</td>
                <td className="px-4 py-2">{new Date(entry.updated_at).toLocaleString()}</td>
                <td className="px-4 py-2">Automatic</td>
                <td className="px-4 py-2">{entry.active ? "Active" : "Inactive"}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => toggleActive(entry.id)}>
                      {entry.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => confirmDelete(entry.id)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>0 of 0 row(s) selected.</span>
                <span>Page 1 of 0</span>
              </div>
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
