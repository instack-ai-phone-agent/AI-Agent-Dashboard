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
  PanelLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, [pathname]);

  const analyticsNav = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  const setupNav = [
    { label: "Agent Design", href: "/agent-designs", icon: Bot },
  ];

  const callsNav = [
    { label: "Call History", href: "/history", icon: PhoneCall },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-black text-white p-4 space-y-6 flex flex-col transition-all duration-300 overflow-hidden",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white w-6 h-6 rounded-sm" />
            {!collapsed && <h2 className="text-xl font-bold md:text-lg">Instack AI</h2>}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-10 w-10 hover:bg-transparent"
          >
            <PanelLeft className="stroke-white w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {!collapsed && <h4 className="text-xs uppercase text-gray-400 tracking-wider px-3 md:text-[10px]">Agents</h4>}
          <AgentsSelection collapsed={collapsed} />
        </div>

        <div className="space-y-2">
          {!collapsed && <h4 className="text-xs uppercase text-gray-400 tracking-wider px-3 md:text-[10px]">Analytics</h4>}
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
              {!collapsed && <span className="md:text-sm text-[13px]">{label}</span>}
            </Link>
          ))}
        </div>

        <div className="space-y-2">
          {!collapsed && <h4 className="text-xs uppercase text-gray-400 tracking-wider px-3 md:text-[10px]">Agent AI Setup</h4>}
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
              {!collapsed && <span className="md:text-sm text-[13px]">{label}</span>}
            </Link>
          ))}
        </div>

        <div className="space-y-2">
          {!collapsed && <h4 className="text-xs uppercase text-gray-400 tracking-wider px-3 md:text-[10px]">Calls</h4>}
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
              {!collapsed && <span className="md:text-sm text-[13px]">{label}</span>}
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-gray-800 space-y-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full text-left flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-800 transition">
                <User className="w-5 h-5" />
                {!collapsed && <span className="md:text-sm text-[13px]">Account</span>}
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
            {!collapsed && <span className="md:text-sm text-[13px]">Settings</span>}
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
