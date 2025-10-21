interface ApiResponse<T> {
  data?: {
    pageSize: number;
    pageNumber: number;
    total: number;
    totalPages: number;
    data: T;
  };
  error?: ApiError;
  }