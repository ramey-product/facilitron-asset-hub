/**
 * API response envelope types shared between API and web app.
 */

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
