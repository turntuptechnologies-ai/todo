export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export interface SSEEvent<T = unknown> {
  type: string;
  data: T;
}
