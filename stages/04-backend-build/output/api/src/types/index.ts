import type { Request } from 'express'
import type { User } from '@supabase/supabase-js'

export interface AuthenticatedRequest extends Request {
  user: User
  requestId: string
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

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'
