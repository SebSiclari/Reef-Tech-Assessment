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
curl "http://localhost:3000/api/financials"
```

2. **Filtered Request**
```bash
curl "http://localhost:3000/api/financials?country=US&city=New%20York&startDate=2024-01-01&endDate=2024-12-31"
```

3. **Paginated Request**
```bash
curl "http://localhost:3000/api/financials?page=1&limit=20&sortBy=desc"
```

### Using Postman

1. Create a new GET request
2. Enter the URL: `http://localhost:3000/api/financials`
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
curl "http://localhost:3000/api/financials?country=US"
```

2. **Filter by Date Range**
```bash
curl "http://localhost:3000/api/financials?startDate=2024-01-01&endDate=2024-03-15"
```

3. **Pagination with Sorting**
```bash
curl "http://localhost:3000/api/financials?page=2&limit=15&sortBy=desc"
```

4. **Multiple Filters**
```bash
curl "http://localhost:3000/api/financials?country=US&city=New%20York&page=1&limit=20"
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
