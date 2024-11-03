export interface YelpBusinessHours {
	is_overnight: boolean;
	start: string;
	end: string;
	day: number;
}

export interface YelpLocation {
	address1: string;
	city: string;
	state: string;
	zip_code: string;
	country: string;
	display_address: string[];
}

export interface YelpBusiness {
	id: string;
	name: string;
	is_closed: boolean;
	location: YelpLocation;
	business_hours?: {
		open: YelpBusinessHours[];
		hours_type: string;
		is_open_now: boolean;
	}[];
}

export interface YelpSearchResponse {
	businesses: YelpBusiness[];
	total: number;
}
