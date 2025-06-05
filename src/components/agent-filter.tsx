import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const agents = [
  { id: "all", name: "All Agents" },
  { id: "agent1", name: "Alice" },
  { id: "agent2", name: "Bob" },
];

export default function AgentFilter({ onChange }: { onChange: (value: string) => void }) {
  return (
    <Select defaultValue="all" onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select agent" />
      </SelectTrigger>
      <SelectContent>
        {agents.map((agent) => (
          <SelectItem key={agent.id} value={agent.id}>
            {agent.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
