export interface SearchRestaurantsParams {
  location: string;
  term?: string;
  categories?: string;
  open_now?: boolean;
  limit?: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  count?: number;
}
