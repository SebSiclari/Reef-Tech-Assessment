
type SortBy = 'date' | 'store_name';
type Order = 'asc' | 'desc';
export interface SearchRestaurantsParams {
  location: string;
  term?: string;
  categories?: string;
  open_now?: boolean;
  limit?: number;
  page?: number;
  sortBy?: SortBy;
  order?: Order;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  count?: number;
}

export interface RestaurantFormatForDatabase {
  store_name: string;
  external_store_id: string;
  country: string;
  country_code: string;
  city: string;
  date: Date; // date of data entry
  restaurant_opened_at: Date; // time restaurant opened at
  menu_available: boolean; // if the menu is available
  restaurant_online: boolean; // if the restaurant is online
  restaurant_offline: boolean; // if the restaurant is offline
}
