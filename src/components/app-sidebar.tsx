"use client";

import { Sidebar } from "@/components/ui/sidebar";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar className="bg-black text-white border-none">
      {children}
    </Sidebar>
  );
}
