# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication

Most endpoints require authentication using JWT tokens.

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "preferredLanguage": "en",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "region": "New York"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "preferredLanguage": "en",
    "region": "New York"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Programs API

### Get All Programs
```http
GET /api/programs?category=HEALTHCARE&region=California
```

**Query Parameters:**
- `category` (optional): HEALTHCARE, EDUCATION, AGRICULTURE, EMPLOYMENT
- `region` (optional): Filter by region

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Rural Health Initiative",
      "description": "Free healthcare for rural communities",
      "category": "HEALTHCARE",
      "eligibilityCriteria": "Rural residents with income below poverty line",
      "applicationDeadline": "2024-12-31",
      "contactInfo": "health@example.com",
      "region": "California",
      "latitude": 36.7783,
      "longitude": -119.4179,
      "isActive": true
    }
  ]
}
```

### Get Program by ID
```http
GET /api/programs/1
```

### Create Program (Admin only)
```http
POST /api/programs
Content-Type: application/json

{
  "name": "Agricultural Subsidy Program",
  "description": "Financial assistance for small farmers",
  "category": "AGRICULTURE",
  "eligibilityCriteria": "Small-scale farmers",
  "region": "Texas",
  "isActive": true
}
```

## Healthcare API

### Get Healthcare Facilities
```http
GET /api/healthcare?type=HOSPITAL&freeServices=true
```

**Query Parameters:**
- `type` (optional): HOSPITAL, CLINIC, VACCINATION_CENTER
- `freeServices` (optional): true/false

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Community Health Center",
      "type": "CLINIC",
      "services": "General checkup, Vaccination, Emergency care",
      "address": "123 Main St, Springfield",
      "latitude": 39.7817,
      "longitude": -89.6501,
      "contactNumber": "+1-555-0123",
      "operatingHours": "Mon-Fri 9AM-5PM",
      "freeServices": true,
      "isActive": true
    }
  ]
}
```

### Get Nearby Facilities
```http
GET /api/healthcare/nearby?latitude=39.7817&longitude=-89.6501&radiusKm=10
```

**Query Parameters:**
- `latitude` (required): User's latitude
- `longitude` (required): User's longitude
- `radiusKm` (optional, default: 10): Search radius in kilometers

## Voice Query API

### Process Voice Query
```http
POST /api/voice-query
Content-Type: application/json

{
  "queryText": "What government subsidies are available for farmers?",
  "language": "en",
  "latitude": 39.7817,
  "longitude": -89.6501,
  "userId": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": "I found 3 agricultural programs available. The top program is: Agricultural Subsidy Program for small-scale farmers in Texas."
}
```

### Get Query History
```http
GET /api/voice-query/history/1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "userId": 1,
      "queryText": "What government subsidies are available for farmers?",
      "queryType": "VOICE",
      "language": "en",
      "response": "I found 3 agricultural programs...",
      "timestamp": "2024-01-15T10:30:00",
      "latitude": 39.7817,
      "longitude": -89.6501
    }
  ]
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

**Common HTTP Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Rate Limiting

API requests are limited to 100 requests per minute per IP address.

## Pagination

For endpoints returning lists, use pagination parameters:

```http
GET /api/programs?page=1&size=20
```

- `page` (default: 0): Page number
- `size` (default: 20): Items per page
