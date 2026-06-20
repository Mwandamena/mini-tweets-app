export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
  meta?: {
    pagination?: PaginationMeta;
    timestamp: string;
    requestId?: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: any;
    stack?: string;
  };
  meta: {
    timestamp: string;
    requestId?: string;
    path?: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
