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
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AgentGuidelinesPopup from "@/components/agent-guidelines-popup";
import { getAgentGuidelines, getAgentDesigns, updateAgentDesign, getDataSources, createDataSource, updateDataSource, deleteDataSource, BASE_URL } from "@/lib/api";
import NumberDialog from "@/components/NumberDialog";
import { Info, Mic, Palette, UploadCloud, FilePlus, Globe, Copy, Pencil } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAgentContext } from "@/lib/AgentContext";

export default function AgentDesignPage() {
  const [guidelinesUpdatedBy, setGuidelinesUpdatedBy] = useState<string>("You");
  const [guidelinesUpdatedAt, setGuidelinesUpdatedAt] = useState<string>(new Date().toISOString());
  const [guidelinesPrompt, setGuidelinesPrompt] = useState("");
  const [editOrgModalOpen, setEditOrgModalOpen] = useState(false);
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
  const { agentName, setAgentName, organizationName, setOrganizationName } = useAgentContext();
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
      setGuidelinesUpdatedBy("You"); // fallback
      setGuidelinesUpdatedAt(new Date().toISOString()); // fallback to now
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
const [newDocOpen, setNewDocOpen] = useState(false);
const [newDocName, setNewDocName] = useState("");
const [newDocText, setNewDocText] = useState("");


const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !agentId) return;

  try {
    const form = new FormData();
    form.append("file", file);
    form.append("name", file.name); // Required for backend
    form.append("voice_agent_id", agentId); // Must match backend's expected field

    const res = await fetch(`${BASE_URL}/data_sources`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
        Accept: "application/json",
      },
      body: form,
    });

    if (!res.ok) throw new Error("Upload failed");

    toast.success("File uploaded successfully");
    refreshDataSources();
  } catch (error) {
    console.error("Upload failed:", error);
    toast.error("Failed to upload file");
  } finally {
    e.target.value = ""; // Reset file input for next upload
  }
};

const handleCreateBlankDoc = async () => {
  if (!agentId) return;
  setNewDocLoading(true);
  try {
    await createDataSource({
      name: newDocName || "Untitled Document",
      text: newDocText || "",
      voice_agent_id: parseInt(agentId),
    });
    toast.success("Blank document created");
    setNewDocOpen(false);
    setNewDocName("");
    setNewDocText("");
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
          <Button variant="default" className="mt-2">Test Your Agent</Button>
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
                          <SelectItem value="alloy">Male</SelectItem>
                          <SelectItem value="echo">Female</SelectItem>
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

                        setGuidelinesUpdatedBy("You");
                        setGuidelinesUpdatedAt(new Date().toISOString());
                      }
                    }}
                    updatedBy={guidelinesUpdatedBy}
                    updatedAt={guidelinesUpdatedAt}
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

            <Dialog open={newDocOpen} onOpenChange={setNewDocOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={newDocLoading}>
                  <FilePlus className="w-4 h-4 mr-1" />
                  Blank Document
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Blank Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input
                      placeholder="e.g. Internal FAQs"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Text</label>
                    <textarea
                      placeholder="Enter content..."
                      value={newDocText}
                      onChange={(e) => setNewDocText(e.target.value)}
                      rows={4}
                      className="w-full border rounded-md px-3 py-2 text-sm resize-y"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setNewDocOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateBlankDoc} disabled={newDocLoading}>
                      {newDocLoading ? "Creating..." : "Create"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>


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
          <div className="flex flex-col gap-6">
            {/* Card 1: Agent Overview */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Your Instack AI Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog open={editOrgModalOpen} onOpenChange={setEditOrgModalOpen}>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Edit Agent Info</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-agent-name">Agent Name</Label>
                      <Input
                        id="edit-agent-name"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-org-name">Organization Name</Label>
                      <Input
                        id="edit-org-name"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setEditOrgModalOpen(false)}>Cancel</Button>
                    <Button
                      onClick={() => {
                        setEditOrgModalOpen(false);
                        // You can call update API here if needed
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone Number</label>
                    <div className="flex items-center gap-2">
                    <Input id="phone" readOnly value="+61359101076" />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText("+61359101076");
                        toast.success("Phone number copied!");
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Agent Name</label>
                    <Input id="agent-name" value={agentName} readOnly />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Organization Name</label>
                    <div className="flex items-center gap-2">
                      <Input id="org-name" value={organizationName} readOnly />
                        <Button size="sm" variant="outline" onClick={() => setEditOrgModalOpen(true)}>
                          <Pencil className="w-4 h-4" />
                        </Button>

                    </div>
                  </div>
                </div>

                <h4 className="mt-6 font-semibold text-base">Share Agent</h4>
                <div className="mt-2 flex flex-wrap gap-3">
                  <Button variant="secondary">Share Agent</Button>
                  <Button variant="outline">Recreate your agent</Button>
                  <Button variant="ghost">Help Center</Button>
                </div>
              </CardContent>
            </Card>
            {/* Card 2: Tabs within settings */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Agent Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="call-settings" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="call-settings">Call Settings</TabsTrigger>
                    <TabsTrigger value="voice">Voice & Personality</TabsTrigger>
                  </TabsList>

                  <TabsContent value="call-settings">
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Call Recordings</label>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          When disabled, no call recording will be available. Transcripts will still be enabled.
                        </p>
                        <Switch checked />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Max Call Duration (minutes)</label>
                      <Input type="number" min="1" value="20" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Agent Timezone</label>
                      <Input value="Melbourne (AEST) (GMT+10:00)" />
                    </div>
                  </TabsContent>

                  <TabsContent value="voice">
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-1">Add Office Noise</label>
                      <p className="text-sm text-gray-600 mb-2">
                        Phonely can add background noise to the conversation to mimic an office environment. Default is off.
                      </p>
                      <Select defaultValue="none">
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="office">Office</SelectItem>
                          <SelectItem value="cafe">Cafe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Agent Personality</label>
                      <Select value={tone || ""} onValueChange={setTone}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select Tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">🤗 Friendly</SelectItem>
                          <SelectItem value="formal">📘 Formal</SelectItem>
                          <SelectItem value="casual">🧢 Casual</SelectItem>
                          <SelectItem value="empathetic">💖 Empathetic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

      </Tabs>
    </DashboardShell>
  );
}
