// lib/api.ts

export const BASE_URL = "https://test.aivocall.com";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function authHeaders(): Record<string, string> {
  const token = getToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// ------------------ Voice Agent APIs ------------------

export async function getVoiceAgents(): Promise<any[]> {
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

export async function createVoiceAgent(data: { name: string; status: boolean; organization_id?: number }): Promise<any> {
  const response = await fetch(`${BASE_URL}/voice_agents`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to create agent");
  return await response.json();
}

export async function updateVoiceAgent(agentId: number, data: { name: string; status: boolean; organization_id?: number }): Promise<void> {
  const response = await fetch(`${BASE_URL}/voice_agents/${agentId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error("Failed to update voice agent");
}

export async function deleteVoiceAgent(agentId: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/voice_agents/${agentId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to delete voice agent");
}

export async function getVoiceAgentsByOrg(organizationId: number): Promise<any[]> {
  const allAgents = await getVoiceAgents();
  return allAgents.filter((agent: any) => agent.organization_id === organizationId);
}

// ------------------ User Organization APIs ------------------

export async function getMyUserOrganizations(): Promise<any[]> {
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

export async function createUserOrganization(name: string): Promise<any> {
  const response = await fetch(`${BASE_URL}/user_organizations`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name }),
  });

  if (!response.ok) throw new Error("Failed to create user organization");
  return await response.json();
}

export async function getUserOrganizationById(id: number): Promise<any | null> {
  const response = await fetch(`${BASE_URL}/user_organizations/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch user organization");
  return await response.json();
}

export async function deleteUserOrganization(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/user_organizations/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to delete user organization");
}

// ------------------ Agent Design APIs ------------------

export async function getAgentDesigns(): Promise<any[]> {
  const response = await fetch(`${BASE_URL}/agent-designs`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch agent designs: ${text}`);
  }

  return await response.json();
}

export async function updateAgentDesign(agentDesignId: string, payload: {
  ai_greeting: string;
  tone: string;
  voice: string;
  guidelines: string;
}): Promise<boolean> {
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

export async function getAgentGuidelines(voiceAgentId: string): Promise<string | null> {
  const response = await fetch(`${BASE_URL}/voice_agents/instructions/${voiceAgentId}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch guidelines");

  return await response.json();
}

// ------------------ Data Source APIs ------------------

type CreateDataSourceParams = {
  name?: string;
  text?: string;
  website?: string;
  voice_agent_id: number;
  file?: File | null;
};

export async function createDataSource(params: CreateDataSourceParams): Promise<any> {
  const formData = new FormData();

  if (params.name) formData.append("name", params.name);
  if (params.text) formData.append("text", params.text);
  if (params.website) formData.append("website", params.website);
  formData.append("voice_agent_id", params.voice_agent_id.toString());
  if (params.file) formData.append("file", params.file);

  const token = localStorage.getItem("access_token");

  const response = await fetch(`${BASE_URL}/data_sources`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      // Do not manually set Content-Type when using FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create data source: ${text}`);
  }

  return await response.json();
}


export async function getDataSources(): Promise<any[]> {
  try {
    const response = await fetch(`${BASE_URL}/data_sources`, {
      method: "GET",
      headers: authHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch data sources");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data sources:", error);
    return [];
  }
}

export async function updateDataSource(dataSourceId: number, data: { name: string; text: string }): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/data_sources/${dataSourceId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update data source: ${errorText}`);
  }

  return true;
}

export async function deleteDataSource(dataSourceId: number): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/data_sources/${dataSourceId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to delete data source: ${errorText}`);
  }

  return true;
}

export const getCallHistory = async (id: string) => {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`https://test.aivocall.com/call_histories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch call history");
  return await res.json();
};

export async function getCallHistories() {
  try {
    const token = localStorage.getItem("access_token");
    const res = await fetch(`${BASE_URL}/call_histories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch call histories");

    return await res.json();
  } catch (err) {
    console.error("Error fetching call histories:", err);
    return [];
  }
}


