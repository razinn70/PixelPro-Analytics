// PixelPro Analytics — Shared TypeScript Types

export interface Product {
  id: string
  client_id: string
  name: string
  description: string | null
  price: number
  category: string | null
  sku: string | null
  inventory_count: number
  active: boolean
  created_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  client_id: string
  session_id: string
  items: OrderLineItem[]
  subtotal: number
  status: 'pending' | 'completed' | 'refunded'
  created_at: string
}

export interface OrderLineItem {
  item_id: string
  name: string
  price: number
  quantity: number
}

export interface AnalyticsEvent {
  client_id: string
  session_id: string
  event_name: string
  event_data: Record<string, unknown>
  page_url: string
  referrer?: string
}

export interface FunnelStep {
  index: number
  name: string
  event: string
  page?: string
}

export interface KPIMetric {
  name: string
  value: number
  change: number
  trend: 'up' | 'down' | 'neutral'
  unit?: string
  formatted?: string
}

export interface ApiResponse<T> {
  data: T
  meta: {
    request_id: string
    timestamp: string
  }
}

export interface ApiError {
  error: {
    code: string
    message: string
    request_id: string
  }
}
