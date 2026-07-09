import type { Node, Edge, Workflow, Execution } from "../types/workflow";

export class ApiError extends Error {
  public status: number;
  public data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

async function fetchClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const headers = new Headers(options.headers);
  if (
    !headers.has("Content-Type") &&
    options.body &&
    typeof options.body === "string"
  ) {
    headers.set("Content-Type", "application/json");
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        data && typeof data === "object" && "error" in data
          ? data.error
          : response.statusText || "An unexpected API error occurred";

      throw new ApiError(String(errorMessage), response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(error instanceof Error ? error.message : "Network Error");
  }
}

// -----------------------------------------------------------------------------
// API Domain Functions
// -----------------------------------------------------------------------------

export const triggerWebhook = (payload: unknown) => {
  return fetchClient("/webhooks/contentful", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getWorkflows = async (): Promise<Workflow[]> => {
  const data = await fetchClient<{ workflows: Workflow[] }>("/workflows");
  return data.workflows;
};

export const getExecutions = async (): Promise<Execution[]> => {
  const data = await fetchClient<{ executions: Execution[] }>("/executions");
  return data.executions;
};

export const deleteWorkflow = (id: string) => {
  return fetchClient(`/workflows/${id}`, {
    method: "DELETE",
  });
};

export const saveWorkflow = (
  id: string,
  name: string,
  nodes: Node[],
  edges: Edge[],
) => {
  const payload = {
    id,
    name,
    trigger_type: "contentful",
    definition: {
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.data.type,
        data: n.data,
        position: n.position,
      })),
      edges: edges.map((e) => ({ source: e.source, target: e.target })),
    },
    is_active: true,
  };

  return fetchClient("/workflows", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
