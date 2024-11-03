export interface SearchRestaurantsParams {
	location: string;
	term?: string;
	categories?: string;
	open_now?: boolean;
	limit?: number;
}
