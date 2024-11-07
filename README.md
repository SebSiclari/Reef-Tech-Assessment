# Testing the Financials Endpoint

The `/financials` endpoint allows you to retrieve financial data with various filtering, pagination, and sorting options.

## Base URL
```
GET http://localhost:3000/api/financials
```

## Query Parameters

| Parameter     | Type    | Description                                      | Example                  |
|--------------|---------|--------------------------------------------------|--------------------------|
| country      | string  | Filter by country code                           | ?country=US              |
| city         | string  | Filter by city name                              | ?city=New%20York         |
| startDate    | string  | Filter by date range (start)                     | ?startDate=2024-01-01    |
| endDate      | string  | Filter by date range (end)                       | ?endDate=2024-12-31      |
| page         | number  | Page number for pagination (default: 1)          | ?page=1                  |
| limit        | number  | Number of items per page (default: 10)           | ?limit=20                |
| sortBy       | string  | Sort by date (asc/desc)                          | ?sortBy=desc             |

## Example Requests

### Using cURL

1. **Basic Request**
```bash
curl "http://localhost:3000/api/v0/financials?location=Miami"
```

2. **Filtered Request**
```bash
curl "http://localhost:3000/api/v0/financials?location=New%20York&startDate=2024-01-01&endDate=2024-12-31"
```

3. **Paginated Request**
```bash
curl "http://localhost:3000/api/v0/financials?location=New%20York&page=1&limit=20&sortBy=desc"
```

### Using Postman

1. Create a new GET request
2. Enter the URL: `http://localhost:3000/api/v0/financials`
3. Add query parameters in the "Params" tab:
   - Key: `country`, Value: `US`
   - Key: `city`, Value: `New York`
   - Key: `page`, Value: `1`
   - Key: `limit`, Value: `20`

## Example Response

```json
{
  "data": [
    {
      "store_name": "Sample Store",
      "external_store_id": "ext123",
      "country": "United States",
      "country_code": "US",
      "city": "New York",
      "date": "2024-03-15T00:00:00.000Z",
      "restaurant_opened_at": "2024-03-15T08:00:00.000Z",
      "menu_available": true,
      "restaurant_online": true,
      "restaurant_offline": false
    }
    // ... more items
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20
  }
}
```

## Response Status Codes

- `200`: Successful request
- `400`: Invalid parameters
- `404`: No data found
- `500`: Server error

## Testing Different Scenarios

1. **Filter by Country**
```bash
curl "http://localhost:3000/api/v0/financials?country=US"
```

2. **Filter by Date Range**
```bash
curl "http://localhost:3000/api/v0/financials?startDate=2024-01-01&endDate=2024-03-15"
```

3. **Pagination with Sorting**
```bash
curl "http://localhost:3000/api/v0/financials?page=2&limit=15&sortBy=desc"
```

4. **Multiple Filters**
```bash
curl "http://localhost:3000/api/v0/financials?country=US&city=New%20York&page=1&limit=20"
```

## Error Response Example

```json
{
  "error": {
    "message": "Invalid date format. Please use YYYY-MM-DD",
    "code": 400
  }
}
```

## Notes

- All dates should be in ISO format (YYYY-MM-DD)
- Country codes should be in ISO 3166-1 alpha-2 format (e.g., US, GB, FR)
- City names with spaces should be URL encoded (e.g., New York → New%20York)
- The default sort order is descending by date if not specified
- Maximum limit per page is 100 items

## Data Mapping from Yelp API

The application maps data from the Yelp Fusion API to our required database schema. Here's how each field is mapped:

| Database Field        | Yelp API Source           | Transformation/Default                    |
|----------------------|---------------------------|------------------------------------------|
| store_name           | business.name             | Direct mapping                           |
| external_store_id    | business.id              | Direct mapping (Yelp's unique ID)        |
| country             | business.location.country | Default to "US" if not provided          |
| country_code        | business.location.country | Default to "US" if not provided          |
| city                | business.location.city    | Direct mapping                           |
| date                | N/A                      | Current timestamp when record is created  |
| restaurant_opened_at | business.business_hours  | Parsed from hours.open[0].start or defaults to 9:00 AM |
| menu_available      | N/A                      | Defaults to true (not provided by Yelp)   |
| restaurant_online   | business.is_closed       | Inverse of is_closed                     |
| restaurant_offline  | business.is_closed       | Direct mapping                           |

### Mapping Logic Details

1. **Opening Hours Processing**
   - Extracts opening time from Yelp's business hours
   - Converts "HHmm" format (e.g., "0900") to DateTime
   - Defaults to 9:00 AM if no hours data available

2. **Online/Offline Status**
   - Derives from Yelp's `is_closed` boolean
   - `restaurant_online = !is_closed`
   - `restaurant_offline = is_closed`

3. **Default Values**
   - Country/Country Code: Defaults to "US" for North American businesses
   - Menu Available: Always true as Yelp API doesn't provide menu availability
   - Date: Set to current timestamp during record creation

### Implementation

The mapping is implemented in the RestaurantService class, specifically in the mapRestaurantsToDatabaseSchema method. See:
