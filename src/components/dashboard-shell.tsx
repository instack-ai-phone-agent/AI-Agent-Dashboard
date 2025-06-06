"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PhoneCall,
  Settings,
  User,
  Bot,
  Menu,
  Users,
} from "lucide-react";
import { useState } from "react";
import AgentsSelection from "@/components/agents-selection";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const analyticsNav = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
  ];

  const setupNav = [
    { label: "Agent Design", href: "/agent-setup", icon: Bot },
  ];

  const callsNav = [
    { label: "Call History", href: "/calls", icon: PhoneCall },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={cn(
        "bg-black text-white p-4 space-y-6 flex flex-col transition-all duration-300 overflow-hidden",
        collapsed ? "w-20" : "w-64"
      )}
      >
        <div className="flex items-center justify-between">
          <h2 className={cn("text-xl font-bold", collapsed && "hidden")}>Instack AI</h2>
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Agents Dropdown only */}
        <div className="space-y-2">
          {!collapsed && <h4 className="text-xs uppercase text-gray-400 tracking-wider px-3">Agents</h4>}
          <AgentsSelection collapsed={collapsed} />
        </div>

        {/* Analytics */}
        <div className="space-y-2">
          {!collapsed && <h4 className="text-xs uppercase text-gray-400 tracking-wider px-3">Analytics</h4>}
          {analyticsNav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition",
                pathname === href && "bg-gray-800"
              )}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </div>

        {/* Agent AI Setup */}
        <div className="space-y-2">
          {!collapsed && <h4 className="text-xs uppercase text-gray-400 tracking-wider px-3">Agent AI Setup</h4>}
          {setupNav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition",
                pathname === href && "bg-gray-800"
              )}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </div>

        {/* Call History */}
        <div className="space-y-2">
          {!collapsed && <h4 className="text-xs uppercase text-gray-400 tracking-wider px-3">Calls</h4>}
          {callsNav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition",
                pathname === href && "bg-gray-800"
              )}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </div>

        {/* User + Settings at bottom */}
        <div className="mt-auto pt-6 border-t border-gray-800 space-y-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full text-left flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition">
                <User className="w-5 h-5" />
                {!collapsed && <span>Account</span>}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black ml-2">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition",
              pathname === "/settings" && "bg-gray-800"
            )}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && <span>Settings</span>}
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
