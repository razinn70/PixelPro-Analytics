import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { fetchMetrics } from '@/lib/api'
import type { KPIMetric, DailyMetric, DateRange } from '@/types'

interface MetricsState {
  kpis: KPIMetric[]
  dailyData: DailyMetric[]
  loading: boolean
  error: string | null
}

/** Sum all rows for a given metric_name. */
function sumMetric(rows: DailyMetric[], name: string): number {
  return rows.filter(r => r.metric_name === name).reduce((acc, r) => acc + r.value, 0)
}

/** Derive the 8 KPIs from a flat array of DailyMetric rows. */
function deriveKPIs(rows: DailyMetric[]): KPIMetric[] {
  const pageViews           = sumMetric(rows, 'page_views')
  const addToCartCount      = sumMetric(rows, 'add_to_cart_count')
  const checkoutInitiated   = sumMetric(rows, 'checkout_initiated')
  const purchaseCount       = sumMetric(rows, 'purchase_count')
  const revenue             = sumMetric(rows, 'revenue')
  const newCustomers        = sumMetric(rows, 'new_customers')
  const returningCustomers  = sumMetric(rows, 'returning_customers')
  const totalCustomers      = sumMetric(rows, 'total_customers')

  const addToCartRate         = pageViews > 0 ? (addToCartCount / pageViews) * 100 : 0
  const cartToCheckoutRate    = addToCartCount > 0 ? (checkoutInitiated / addToCartCount) * 100 : 0
  const checkoutCompletionRate = checkoutInitiated > 0 ? (purchaseCount / checkoutInitiated) * 100 : 0
  const cartAbandonmentRate   = 100 - checkoutCompletionRate
  const aov                   = purchaseCount > 0 ? revenue / purchaseCount : 0
  const revenueByCategory     = revenue
  const newCustomerCount      = newCustomers
  const returningCustomerRate = totalCustomers > 0 ? (returningCustomers / totalCustomers) * 100 : 0

  return [
    { name: 'Add-to-Cart Rate',         value: addToCartRate,          unit: 'percent'  },
    { name: 'Cart-to-Checkout Rate',     value: cartToCheckoutRate,     unit: 'percent'  },
    { name: 'Checkout Completion Rate',  value: checkoutCompletionRate, unit: 'percent'  },
    { name: 'Cart Abandonment Rate',     value: cartAbandonmentRate,    unit: 'percent'  },
    { name: 'Average Order Value',       value: aov,                    unit: 'currency' },
    { name: 'Revenue by Category',       value: revenueByCategory,      unit: 'currency' },
    { name: 'New Customers',             value: newCustomerCount,        unit: 'count'    },
    { name: '30-Day Returning Customer Rate', value: returningCustomerRate, unit: 'percent' },
  ]
}

export function useMetrics(clientId: string, dateRange: DateRange): MetricsState {
  const [state, setState] = useState<MetricsState>({
    kpis: [],
    dailyData: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    setState(s => ({ ...s, loading: true, error: null }))

    const from = format(dateRange.from, 'yyyy-MM-dd')
    const to   = format(dateRange.to,   'yyyy-MM-dd')

    fetchMetrics(clientId, from, to)
      .then(rows => {
        if (cancelled) return
        setState({
          kpis:      deriveKPIs(rows),
          dailyData: rows,
          loading:   false,
          error:     null,
        })
      })
      .catch(err => {
        if (cancelled) return
        setState(s => ({
          ...s,
          loading: false,
          error:   (err as Error).message,
        }))
      })

    return () => { cancelled = true }
  }, [clientId, dateRange.from.toISOString(), dateRange.to.toISOString()])

  return state
}
