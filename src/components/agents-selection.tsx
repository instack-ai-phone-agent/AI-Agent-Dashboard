"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Agent {
  name: string;
  phone: string;
  href: string;
}

interface Organization {
  id: string;
  name: string;
}

export default function AgentsSelection({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [orgSearch, setOrgSearch] = useState("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [agentName, setAgentName] = useState("");
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const companyName = "Acme Corp"; // Placeholder until dynamic

  useEffect(() => {
    const fetchAgents = async () => {
      const res = await fetch("/voice_agents");
      const data = await res.json();
      const formatted = data.map((agent: any) => ({
        name: agent.name,
        phone: agent.phone_number,
        href: `/agents/${agent.id}`,
      }));
      setAgents(formatted);
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    if (orgSearch.trim() === "") return;
    const timeout = setTimeout(async () => {
      const res = await fetch(`/organizations?search=${orgSearch}`);
      const data = await res.json();
      setOrganizations(data);
    }, 300);
    return () => clearTimeout(timeout);
  }, [orgSearch]);

  const handleCreateAgent = async () => {
    if (!selectedOrgId || !agentName) return;
    setCreating(true);
    try {
      const res = await fetch("/voice_agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_id: selectedOrgId,
          name: agentName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Creation failed");
      router.push(`/agent-setup/${data.id}`);
    } catch (err) {
      console.error("Agent creation failed:", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center w-full gap-2 px-3 py-2 rounded hover:bg-gray-800 transition ${
            open ? "bg-gray-800" : ""
          }`}
        >
          <Users className="w-5 h-5" />
          {!collapsed && <span>Agents</span>}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={-4}
        className="z-50 w-72 bg-white text-gray-900 shadow-lg"
      >
        <DropdownMenuLabel className="text-sm text-gray-600 mb-1">
          Company: <span className="font-semibold">{companyName}</span>
        </DropdownMenuLabel>

        {agents.map((agent) => (
          <DropdownMenuItem
            asChild
            key={agent.href}
            className="flex flex-col items-start gap-0.5 px-3 py-2 hover:bg-gray-100"
          >
            <Link href={agent.href} className="w-full">
              <span className="font-medium">{agent.name}</span>
              <span className="text-xs text-gray-500">{agent.phone}</span>
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <button className="w-full text-pink-600 font-medium text-sm py-1 text-left">
                + Create Agent
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create AI Agent</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Agent Name</label>
                  <Input
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="e.g. SalesBot"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Organization</label>
                  <Input
                    value={orgSearch}
                    onChange={(e) => setOrgSearch(e.target.value)}
                    placeholder="Search organization..."
                  />
                  <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                    {organizations.map((org) => (
                      <button
                        key={org.id}
                        onClick={() => {
                          setSelectedOrgId(org.id);
                          setOrgSearch(org.name);
                        }}
                        className={`w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100 ${
                          selectedOrgId === org.id ? "bg-gray-100 font-medium" : ""
                        }`}
                      >
                        {org.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button
                  onClick={handleCreateAgent}
                  disabled={creating || !agentName || !selectedOrgId}
                >
                  {creating ? "Creating..." : "Create Agent"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
