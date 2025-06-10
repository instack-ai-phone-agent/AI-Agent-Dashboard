"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Users, PlusCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { getVoiceAgents, createVoiceAgent } from "@/lib/api"

interface Agent {
  id: string
  name: string
  phone_number?: string
}

export default function AgentsSelection({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [agentName, setAgentName] = useState("")
  const [organizationName, setOrganizationName] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const companyName = "Acme Corp" // Optional default fallback

  const fetchAgents = async () => {
    try {
      const data = await getVoiceAgents()
      setAgents(data)
    } catch (err) {
      console.error("Failed to load agents:", err)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [])

  const handleCreateAgent = async () => {
    if (!agentName || !organizationName) return
    setLoading(true)

    try {
      const response = await fetch("https://test.aivocall.com/voice_agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ name: organizationName, status: true }),
      })

      if (!response.ok) throw new Error("Failed to create agent")

      await fetchAgents()
      toast.success(`Agent "${agentName}" created successfully`)
      setDialogOpen(false)
      setAgentName("")
      setOrganizationName("")

      const agentsRefetched = await getVoiceAgents()
      const latestAgent = agentsRefetched.find((a: Agent) => a.name === organizationName)
      if (latestAgent) {
        router.push(`/agent-setup?id=${latestAgent.id}`)
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center w-full gap-2 px-3 py-2 rounded transition ${
                open ? "bg-gray-800" : "hover:bg-gray-800"
              } ${collapsed ? "justify-center" : ""}`}
              disabled={collapsed}
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
              Organization: <span className="font-semibold">{companyName}</span>
            </DropdownMenuLabel>

            {agents.map((agent) => (
              <DropdownMenuItem
                asChild
                key={agent.id}
                className="flex flex-col items-start gap-0.5 px-3 py-2 hover:bg-gray-100"
              >
                <Link href={`/agent-setup?id=${agent.id}`} className="w-full">
                  <span className="font-medium">{agent.name}</span>
                  {agent.phone_number && (
                    <span className="text-xs text-gray-500">{agent.phone_number}</span>
                  )}
                </Link>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <DialogTrigger asChild>
                <button className="w-full text-pink-600 font-medium text-sm py-1 flex items-center gap-1">
                  <PlusCircle className="w-4 h-4" />
                  Create Agent
                </button>
              </DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New AI Agent</DialogTitle>
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
              <label className="block text-sm font-medium mb-1">Organization Name</label>
              <Input
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g. Acme Inc."
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateAgent} disabled={loading || !agentName || !organizationName}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
