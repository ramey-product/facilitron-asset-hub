const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface FetchOptions {
  method?: string;
  body?: unknown;
  params?: Record<string, string | number | undefined>;
}

async function fetchApi<T>(path: string, options?: FetchOptions): Promise<T> {
  let url = `${API_BASE}${path}`;

  if (options?.params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options.params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) {
      url += `?${qs}`;
    }
  }

  const init: RequestInit = {
    headers: { "Content-Type": "application/json" },
  };

  if (options?.method) {
    init.method = options.method;
  }

  if (options?.body) {
    init.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, init);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "API error" }));
    throw new Error(error.error ?? `API error: ${res.status}`);
  }

  return res.json();
}

export const apiClient = {
  assets: {
    list: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/assets", { params }),
    getById: (id: number) =>
      fetchApi(`/api/v2/assets/${id}`),
    create: (data: unknown) =>
      fetchApi("/api/v2/assets", { method: "POST", body: data }),
    update: (id: number, data: unknown) =>
      fetchApi(`/api/v2/assets/${id}`, { method: "PUT", body: data }),
    delete: (id: number) =>
      fetchApi(`/api/v2/assets/${id}`, { method: "DELETE" }),
  },
  manufacturers: {
    search: (q: string) =>
      fetchApi("/api/v2/manufacturers", { params: { q } }),
    getById: (id: number) =>
      fetchApi(`/api/v2/manufacturers/${id}`),
    getModels: (id: number, q?: string) =>
      fetchApi(`/api/v2/manufacturers/${id}/models`, { params: q ? { q } : undefined }),
    create: (data: unknown) =>
      fetchApi("/api/v2/manufacturers", { method: "POST", body: data }),
    createModel: (id: number, data: unknown) =>
      fetchApi(`/api/v2/manufacturers/${id}/models`, { method: "POST", body: data }),
  },
  settings: {
    getAll: () => fetchApi("/api/v2/settings"),
    update: (key: string, value: unknown) =>
      fetchApi(`/api/v2/settings/${key}`, { method: "PUT", body: { value } }),
    categories: {
      list: () => fetchApi("/api/v2/settings/categories"),
      create: (data: unknown) =>
        fetchApi("/api/v2/settings/categories", { method: "POST", body: data }),
      update: (id: number, data: unknown) =>
        fetchApi(`/api/v2/settings/categories/${id}`, { method: "PUT", body: data }),
      delete: (id: number) =>
        fetchApi(`/api/v2/settings/categories/${id}`, { method: "DELETE" }),
    },
  },
  conditions: {
    getScale: () =>
      fetchApi("/api/v2/conditions/scale"),
    getHistory: (assetId: number, params?: Record<string, string | number>) =>
      fetchApi(`/api/v2/assets/${assetId}/conditions/history`, { params }),
    getStats: (assetId: number) =>
      fetchApi(`/api/v2/assets/${assetId}/conditions/stats`),
    log: (assetId: number, data: unknown) =>
      fetchApi(`/api/v2/assets/${assetId}/conditions`, { method: "POST", body: data }),
  },
  dashboard: {
    stats: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/dashboard/stats", { params }),
    alerts: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/dashboard/alerts", { params }),
    activity: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/dashboard/activity", { params }),
  },
  hierarchies: {
    getTree: (assetId: number) =>
      fetchApi(`/api/v2/assets/${assetId}/tree`),
    getRollup: (assetId: number) =>
      fetchApi(`/api/v2/assets/${assetId}/rollup`),
    reparent: (assetId: number, data: { parentId: number | null }) =>
      fetchApi(`/api/v2/assets/${assetId}/parent`, { method: "PUT", body: data }),
  },
  status: {
    get: (assetId: number) =>
      fetchApi(`/api/v2/assets/${assetId}/status`),
    update: (assetId: number, data: { status: "online" | "offline"; reasonCode?: string; notes?: string }) =>
      fetchApi(`/api/v2/assets/${assetId}/status`, { method: "PUT", body: data }),
    reasons: () =>
      fetchApi("/api/v2/status-reasons"),
  },
  properties: {
    list: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/properties", { params }),
    getById: (id: number) =>
      fetchApi(`/api/v2/properties/${id}`),
  },
  costs: {
    getSummary: (assetId: number) =>
      fetchApi(`/api/v2/assets/${assetId}/costs`),
    getHistory: (assetId: number) =>
      fetchApi(`/api/v2/assets/${assetId}/costs/history`),
    getTopCost: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/assets/costs/top", { params }),
  },
  import: {
    validate: (data: unknown) =>
      fetchApi("/api/v2/import/validate", { method: "POST", body: data }),
    execute: (data: unknown) =>
      fetchApi("/api/v2/import/execute", { method: "POST", body: data }),
    history: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/import/history", { params }),
    template: () =>
      fetchApi("/api/v2/import/template"),
  },
  photos: {
    list: (assetId: number) =>
      fetchApi(`/api/v2/assets/${assetId}/photos`),
    upload: (assetId: number, data: unknown) =>
      fetchApi(`/api/v2/assets/${assetId}/photos`, { method: "POST", body: data }),
    delete: (assetId: number, photoId: number) =>
      fetchApi(`/api/v2/assets/${assetId}/photos/${photoId}`, { method: "DELETE" }),
    setPrimary: (assetId: number, photoId: number) =>
      fetchApi(`/api/v2/assets/${assetId}/photos/${photoId}/primary`, { method: "PUT" }),
  },
  documents: {
    list: (assetId: number) =>
      fetchApi(`/api/v2/assets/${assetId}/documents`),
    upload: (assetId: number, data: unknown) =>
      fetchApi(`/api/v2/assets/${assetId}/documents`, { method: "POST", body: data }),
    delete: (assetId: number, docId: number) =>
      fetchApi(`/api/v2/assets/${assetId}/documents/${docId}`, { method: "DELETE" }),
  },
  customFields: {
    definitions: () =>
      fetchApi("/api/v2/custom-fields"),
    getValues: (assetId: number) =>
      fetchApi(`/api/v2/assets/${assetId}/custom-fields`),
    updateValues: (assetId: number, data: unknown) =>
      fetchApi(`/api/v2/assets/${assetId}/custom-fields`, { method: "PUT", body: data }),
  },
  fit: {
    summary: (assetId: number) =>
      fetchApi(`/api/v2/assets/${assetId}/fit-summary`),
    inspections: (assetId: number, params?: Record<string, string | number>) =>
      fetchApi(`/api/v2/assets/${assetId}/fit-inspections`, { params }),
  },
};
