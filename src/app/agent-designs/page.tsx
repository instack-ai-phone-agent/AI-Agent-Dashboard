import { Suspense } from "react";
import AgentDesignClient from "./AgentDesignClient";

export default function AgentDesignWrapper() {
  return (
    <Suspense fallback={<div>Loading agent design...</div>}>
      <AgentDesignClient />
    </Suspense>
  );
}
