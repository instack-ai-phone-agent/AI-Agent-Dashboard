"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AgentContextType {
  agentName: string;
  setAgentName: (name: string) => void;
  organizationName: string;
  setOrganizationName: (name: string) => void;
}

const AgentContext = createContext<any>(null);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [agentName, setAgentName] = useState("");
  const [organizationName, setOrganizationName] = useState("");

  return (
    <AgentContext.Provider value={{ agentName, setAgentName, organizationName, setOrganizationName }}>
      {children}
    </AgentContext.Provider>
  );
};

export const useAgentContext = () => {
  const context = useContext(AgentContext);
  if (!context) throw new Error("useAgentContext must be used within an AgentProvider");
  return context;
};
