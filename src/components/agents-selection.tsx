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

const agents = [
  { name: "SalesBot", phone: "+61 400 111 222", href: "/agents/salesbot" },
  { name: "SupportBot", phone: "+61 400 333 444", href: "/agents/supportbot" },
  { name: "InboundBot", phone: "+61 400 555 666", href: "/agents/inboundbot" },
];

export default function AgentsSelection() {
  const [open, setOpen] = useState(false);
  const companyName = "Acme Corp"; // Replace with dynamic user profile

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition cursor-pointer ${
            open ? "bg-gray-800" : ""
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Agents</span>
        </div>
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
          <Link
            href="/agents/create"
            className="w-full text-pink-600 font-medium text-sm py-1"
          >
            + Create Agent
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
