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

    if (!response.ok) throw new Error("Failed to fetch voice agents");

    return await response.json();
  } catch (error) {
    console.error("Error fetching voice agents:", error);
    return [];
  }
}

export async function createVoiceAgent(data: { name: string; status: boolean; organization_id?: number }) {
  try {
    const response = await fetch(`${BASE_URL}/voice_agents`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to create agent");

    return await response.json();
  } catch (error) {
    console.error("Error creating voice agent:", error);
    throw error;
  }
}

export async function updateVoiceAgent(agentId: number, data: { name: string; status: boolean; organization_id?: number }) {
  try {
    const response = await fetch(`${BASE_URL}/voice_agents/${agentId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to update voice agent");
  } catch (error) {
    console.error("Error updating voice agent:", error);
    throw error;
  }
}

export async function deleteVoiceAgent(agentId: number) {
  try {
    const response = await fetch(`${BASE_URL}/voice_agents/${agentId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!response.ok) throw new Error("Failed to delete voice agent");
  } catch (error) {
    console.error("Error deleting voice agent:", error);
    throw error;
  }
}

export async function getMyUserOrganizations() {
  try {
    const response = await fetch(`${BASE_URL}/user_organizations/me`, {
      method: "GET",
      headers: authHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch user organizations");

    return await response.json();
  } catch (error) {
    console.error("Error fetching user organizations:", error);
    return [];
  }
}

export async function createUserOrganization(name: string) {
  try {
    const response = await fetch(`${BASE_URL}/user_organizations`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ name }),
    });

    if (!response.ok) throw new Error("Failed to create user organization");

    return await response.json();
  } catch (error) {
    console.error("Error creating user organization:", error);
    throw error;
  }
}

export async function getUserOrganizationById(id: number) {
  try {
    const response = await fetch(`${BASE_URL}/user_organizations/${id}`, {
      method: "GET",
      headers: authHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch user organization");

    return await response.json();
  } catch (error) {
    console.error("Error fetching user organization by ID:", error);
    return null;
  }
}

export async function deleteUserOrganization(id: number) {
  try {
    const response = await fetch(`${BASE_URL}/user_organizations/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!response.ok) throw new Error("Failed to delete user organization");
  } catch (error) {
    console.error("Error deleting user organization:", error);
    throw error;
  }
}

export async function getVoiceAgentsByOrg(organizationId: number) {
  try {
    const allAgents = await getVoiceAgents();
    return allAgents.filter((agent: any) => agent.organization_id === organizationId);
  } catch (error) {
    console.error("Error filtering voice agents by org:", error);
    return [];
  }
}

export async function getAgentDesigns() {
  try {
    const response = await fetch(`${BASE_URL}/agent-designs`, {
      method: "GET",
      headers: authHeaders(),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to fetch agent designs: ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching agent designs:", error);
    return [];
  }
}

export async function updateAgentDesign(agentDesignId: string, payload: {
  ai_greeting: string;
  tone: string;
  voice: string;
  guidelines: string;
}) {
  const response = await fetch(`${BASE_URL}/agent-designs/${agentDesignId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to update design: ${text}`);
  }

  return true;
}

export async function getAgentGuidelines(voiceAgentId: string) {
  try {
    const response = await fetch(`${BASE_URL}/voice_agents/instructions/${voiceAgentId}`, {
      method: "GET",
      headers: authHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch guidelines");

    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}


