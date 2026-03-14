// PixelPro Analytics — API Client

import type { Product, ApiResponse } from '@/types'

const BASE_URL = import.meta.env.VITE_API_URL as string

export class ApiClientError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: { code: 'UNKNOWN', message: res.statusText } }))
    throw new ApiClientError(
      body.error?.code ?? 'UNKNOWN',
      body.error?.message ?? res.statusText,
      res.status
    )
  }

  const json: ApiResponse<T> = await res.json()
  return json.data
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function fetchProducts(params?: {
  category?: string
  minPrice?: number
  maxPrice?: number
}): Promise<Product[]> {
  const qs = new URLSearchParams()
  const clientId = import.meta.env.VITE_CLIENT_ID as string
  qs.set('client_id', clientId)
  if (params?.category) qs.set('category', params.category)
  if (params?.minPrice !== undefined) qs.set('min_price', String(params.minPrice))
  if (params?.maxPrice !== undefined) qs.set('max_price', String(params.maxPrice))

  return apiFetch<Product[]>(`/api/v1/products?${qs}`)
}

export async function fetchProduct(id: string): Promise<Product> {
  return apiFetch<Product>(`/api/v1/products/${id}`)
}

// ─── Events (custom analytics ingest) ───────────────────────────────────────

export async function postEvent(payload: {
  client_id:   string
  session_id:  string
  event_name:  string
  event_data?: Record<string, unknown>
  page_url:    string
  referrer?:   string
}): Promise<void> {
  await apiFetch<void>('/api/v1/events', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function postOrder(payload: {
  client_id:  string
  session_id: string
  items:      Array<{ item_id: string; name: string; price: number; quantity: number }>
  subtotal:   number
}): Promise<{ id: string }> {
  return apiFetch<{ id: string }>('/api/v1/orders', {
    method: 'POST',
    body:   JSON.stringify(payload),
  })
}
