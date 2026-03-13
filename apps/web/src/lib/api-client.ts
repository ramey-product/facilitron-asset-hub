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
  inventory: {
    list: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/inventory", { params }),
    categories: () =>
      fetchApi("/api/v2/inventory/categories"),
    getById: (id: number) =>
      fetchApi(`/api/v2/inventory/${id}`),
    create: (data: unknown) =>
      fetchApi("/api/v2/inventory", { method: "POST", body: data }),
    update: (id: number, data: unknown) =>
      fetchApi(`/api/v2/inventory/${id}`, { method: "PUT", body: data }),
    delete: (id: number) =>
      fetchApi(`/api/v2/inventory/${id}`, { method: "DELETE" }),
    bulkActivate: (ids: number[]) =>
      fetchApi("/api/v2/inventory/bulk-activate", { method: "POST", body: { ids } }),
    bulkDeactivate: (ids: number[]) =>
      fetchApi("/api/v2/inventory/bulk-deactivate", { method: "POST", body: { ids } }),
  },
  stock: {
    getByPart: (partId: number) =>
      fetchApi(`/api/v2/stock/${partId}`),
    rollup: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/stock/rollup", { params }),
    alerts: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/stock/alerts", { params }),
    adjust: (partId: number, locationId: number, data: unknown) =>
      fetchApi(`/api/v2/stock/${partId}/${locationId}`, { method: "PUT", body: data }),
  },
  vendors: {
    list: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/procurement/vendors", { params }),
    getById: (id: number) =>
      fetchApi(`/api/v2/procurement/vendors/${id}`),
    performance: (id: number) =>
      fetchApi(`/api/v2/procurement/vendors/${id}/performance`),
    compare: (ids: number[]) =>
      fetchApi(`/api/v2/procurement/vendors/compare`, { params: { ids: ids.join(",") } }),
  },
  consumption: {
    list: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/consumption", { params }),
    forecast: (partId: number) =>
      fetchApi("/api/v2/consumption/forecast", { params: { partId } }),
  },
  audit: {
    inventory: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/audit/inventory", { params }),
  },
  procurement: {
    orders: {
      list: (params?: Record<string, string | number>) =>
        fetchApi("/api/v2/procurement/orders", { params }),
      analytics: () =>
        fetchApi("/api/v2/procurement/orders/analytics"),
      getById: (id: number) =>
        fetchApi(`/api/v2/procurement/orders/${id}`),
      create: (data: unknown) =>
        fetchApi("/api/v2/procurement/orders", { method: "POST", body: data }),
      update: (id: number, data: unknown) =>
        fetchApi(`/api/v2/procurement/orders/${id}`, { method: "PUT", body: data }),
      submit: (id: number) =>
        fetchApi(`/api/v2/procurement/orders/${id}/submit`, { method: "POST", body: {} }),
      approve: (id: number, approvedBy: number) =>
        fetchApi(`/api/v2/procurement/orders/${id}/approve`, { method: "POST", body: { approvedBy } }),
      cancel: (id: number) =>
        fetchApi(`/api/v2/procurement/orders/${id}/cancel`, { method: "POST", body: {} }),
      markOrdered: (id: number) =>
        fetchApi(`/api/v2/procurement/orders/${id}/mark-ordered`, { method: "POST", body: {} }),
    },
    receiving: {
      list: (params?: Record<string, string | number>) =>
        fetchApi("/api/v2/procurement/receiving", { params }),
      getById: (id: number) =>
        fetchApi(`/api/v2/procurement/receiving/${id}`),
      create: (data: unknown) =>
        fetchApi("/api/v2/procurement/receiving", { method: "POST", body: data }),
      discrepancies: () =>
        fetchApi("/api/v2/procurement/receiving/discrepancies"),
    },
  },
  alerts: {
    list: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/inventory/alerts", { params }),
    dismiss: (id: number) =>
      fetchApi(`/api/v2/inventory/alerts/${id}/dismiss`, { method: "POST" }),
    convertToPO: (id: number) =>
      fetchApi(`/api/v2/inventory/alerts/${id}/convert-to-po`, { method: "POST" }),
    rules: {
      list: () => fetchApi("/api/v2/inventory/reorder-rules"),
      create: (data: unknown) =>
        fetchApi("/api/v2/inventory/reorder-rules", { method: "POST", body: data }),
      update: (id: number, data: unknown) =>
        fetchApi(`/api/v2/inventory/reorder-rules/${id}`, { method: "PUT", body: data }),
      delete: (id: number) =>
        fetchApi(`/api/v2/inventory/reorder-rules/${id}`, { method: "DELETE" }),
    },
  },
  kitting: {
    list: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/inventory/kits", { params }),
    getById: (id: number) =>
      fetchApi(`/api/v2/inventory/kits/${id}`),
    create: (data: unknown) =>
      fetchApi("/api/v2/inventory/kits", { method: "POST", body: data }),
    update: (id: number, data: unknown) =>
      fetchApi(`/api/v2/inventory/kits/${id}`, { method: "PUT", body: data }),
    delete: (id: number) =>
      fetchApi(`/api/v2/inventory/kits/${id}`, { method: "DELETE" }),
    checkout: (data: unknown) => {
      const kitId = (data as { kitId: number }).kitId;
      return fetchApi(`/api/v2/inventory/kits/${kitId}/checkout`, {
        method: "POST",
        body: data,
      });
    },
  },
  transfers: {
    list: (params?: Record<string, string | number>) =>
      fetchApi("/api/v2/inventory/transfers", { params }),
    getById: (id: number) =>
      fetchApi(`/api/v2/inventory/transfers/${id}`),
    create: (data: unknown) =>
      fetchApi("/api/v2/inventory/transfers", { method: "POST", body: data }),
    approve: (id: number) =>
      fetchApi(`/api/v2/inventory/transfers/${id}/approve`, { method: "POST" }),
    ship: (id: number) =>
      fetchApi(`/api/v2/inventory/transfers/${id}/ship`, { method: "POST" }),
    receive: (id: number) =>
      fetchApi(`/api/v2/inventory/transfers/${id}/receive`, { method: "POST" }),
    cancel: (id: number) =>
      fetchApi(`/api/v2/inventory/transfers/${id}/cancel`, { method: "POST" }),
  },
};
