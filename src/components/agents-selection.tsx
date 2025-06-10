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

interface Agent {
  id: string
  name: string
  phone_number: string
}

export default function AgentsSelection({ collapsed }: { collapsed: boolean }) {
  const [open, setOpen] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newAgentName, setNewAgentName] = useState("")
  const [newPhoneNumber, setNewPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const companyName = "Acme Corp" // Replace with dynamic organization

  useEffect(() => {
    fetch("https://test.aivocall.com/voice_agents")
      .then((res) => res.json())
      .then((data) => setAgents(data))
      .catch(console.error)
  }, [])

  const handleCreateAgent = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://test.aivocall.com/voice_agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newAgentName,
          phone_number: newPhoneNumber,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || "Failed to create agent")

      router.push(`/agent-setup?id=${data.id}`)
    } catch (err: any) {
      console.error(err)
      alert(err.message || "Something went wrong")
    } finally {
      setLoading(false)
      setDialogOpen(false)
      setNewAgentName("")
      setNewPhoneNumber("")
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
                <Link href={`/agents/${agent.id}`} className="w-full">
                  <span className="font-medium">{agent.name}</span>
                  <span className="text-xs text-gray-500">{agent.phone_number}</span>
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
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                placeholder="e.g. SalesBot"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <Input
                value={newPhoneNumber}
                onChange={(e) => setNewPhoneNumber(e.target.value)}
                placeholder="+61 400 111 222"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateAgent} disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
