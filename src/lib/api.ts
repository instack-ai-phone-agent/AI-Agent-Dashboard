// lib/api.ts

export const BASE_URL = "https://test.aivocall.com"

function getToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

export function authHeaders(): Record<string, string> {
  const token = getToken()
  console.log("TOKEN USED:", token)

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  } else {
    console.warn("No access token found in localStorage.")
  }

  return headers
}

export async function getVoiceAgents() {
  const token = getToken()
  if (!token) throw new Error("No access token present")

  const res = await fetch(`${BASE_URL}/voice_agents`, {
    headers: authHeaders(),
  })

  if (!res.ok) throw new Error("Failed to fetch agents")
  return await res.json() // returns []
}

export async function createVoiceAgent(data: { name: string; status: boolean }) {
  const res = await fetch(`${BASE_URL}/voice_agents`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Failed to create agent: ${errText}`)
  }

  // No response body is returned — just 201 Created
  return true
}
