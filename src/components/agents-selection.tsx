"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const agents = [
  { name: "SalesBot", phone: "+61 400 111 222", href: "/agents/salesbot" },
  { name: "SupportBot", phone: "+61 400 333 444", href: "/agents/supportbot" },
  { name: "InboundBot", phone: "+61 400 555 666", href: "/agents/inboundbot" },
];

export default function AgentsSelection({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [organization, setOrganization] = useState("");

  const companyName = "Acme Corp"; // Replace with actual

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: agentName, organization }),
      });

      if (!res.ok) throw new Error("Failed to create agent");

      const result = await res.json();
      window.location.href = `/agent-setup/${result.id}`; // redirect to new agent
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DropdownMenu open={!collapsed && open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center w-full gap-2 px-3 py-2 rounded transition ${
            open && !collapsed ? "bg-gray-800" : "hover:bg-gray-800"
          }`}
        >
          <Users className="w-5 h-5" />
          {!collapsed && <span>Agents</span>}
        </button>
      </DropdownMenuTrigger>

      {!collapsed && (
        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={-4}
          className="z-50 w-72 bg-white text-gray-900 shadow-lg"
        >
          {/* Org Dropdown */}
          <DropdownMenuLabel className="text-sm text-gray-600 mb-1">
            Organization: <span className="font-semibold">{companyName}</span>
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
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Create New Agent</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Agent Name
                    </label>
                    <Input
                      placeholder="e.g. SalesBot"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">
                      Organization
                    </label>
                    <Input
                      placeholder="e.g. Acme Corp"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreate} className="w-full">
                    Create
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
