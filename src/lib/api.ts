// lib/api.ts

export const BASE_URL = "https://test.aivocall.com";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  console.log("TOKEN USED:", token);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.warn("No access token found in localStorage.");
  }

  return headers;
}

export async function getVoiceAgents() {
  try {
    const response = await fetch(`${BASE_URL}/voice_agents`, {
      method: "GET",
      headers: authHeaders(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch voice agents: ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching voice agents:", error);
    return [];
  }
}

export async function createVoiceAgent(data: { name: string; status: boolean }) {
  try {
    const response = await fetch(`${BASE_URL}/voice_agents`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to create voice agent: ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating voice agent:", error);
    throw error;
  }
}

export async function getAgentDesigns() {
  return [
    {
      id: 1,
      ai_greeting: "hi",
      voice_agent_id: "mock-1",
      tone: "friendly",
      voice: "voice-1",
      guidelines: "be helpful",
    },
    {
      id: 2,
      ai_greeting: null,
      voice_agent_id: "mock-2",
      tone: null,
      voice: null,
      guidelines: null,
    },
  ];
}

export async function updateAgentDesign(agentDesignId: string, data: any) {
  console.log(`Simulated update for agentDesign ${agentDesignId}:`, data);
  return true;
}

export async function getAgentGuidelines(agentDesignId: string) {
  console.log(`Fetching guidelines for agentDesign ${agentDesignId}`);
  return {
    role: "As the AI receptionist for Acme Inc...",
    background: "Acme Inc. is a global tech consultancy...",
    personality: "Friendly, Professional, Enthusiastic",
    responsibilities: "Answer questions, route calls, capture leads",
    dontKnow: "Say you will escalate, collect name/email/phone",
    scenarios: "Handle angry customers and inappropriate requests...",
  };
}

export async function updateAgentGuidelines(agentDesignId: string, data: any) {
  console.log(`Saving guidelines for agentDesign ${agentDesignId}:`, data);
  return true;
}

export async function getStaticAudioList() {
  try {
    const response = await fetch(`${BASE_URL}/list_static_audios`, {
      method: "GET",
      headers: authHeaders(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch audio list: ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching static audio list:", error);
    return [];
  }
}

export async function getCallHistory() {
  return [
    {
      id: "call-1",
      agent_name: "SalesBot",
      phone_number: "+61 400 000 001",
      date: "2023-10-01T12:00:00Z",
      duration: 120,
      recording_url: "https://example.com/recording1.mp3",
    },
    {
      id: "call-2",
      agent_name: "SupportBot",
      phone_number: "+61 400 000 002",
      date: "2023-10-02T14:30:00Z",
      duration: 90,
      recording_url: "https://example.com/recording2.mp3",
    },
  ];
}
