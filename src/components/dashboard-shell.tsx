"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PhoneCall,
  Settings,
  Bell,
  Search,
  User,
  Bot,
} from "lucide-react";

import AgentsSelection from "@/components/agents-selection";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
      <aside className="w-64 bg-black text-white p-4 space-y-6 flex flex-col relative">
        <h2 className="text-xl font-bold">Instack AI</h2>

        {/* Agents */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase text-gray-400 tracking-wider px-3">Agents</h4>
          <AgentsSelection />
        </div>

        {/* Analytics */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase text-gray-400 tracking-wider px-3">Analytics</h4>
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
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Agent AI Setup */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase text-gray-400 tracking-wider px-3">Agent AI Setup</h4>
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
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Call History */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase text-gray-400 tracking-wider px-3">Calls</h4>
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
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Settings at bottom */}
        <div className="mt-auto pt-6 border-t border-gray-800">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition",
              pathname === "/settings" && "bg-gray-800"
            )}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-200 px-3 py-1 rounded-md text-sm w-64 focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-black" />
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
              <User className="w-4 h-4 text-black" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
