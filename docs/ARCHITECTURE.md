# Architecture Guide

## System Overview

CivicBridge AI follows a three-tier architecture with a shared backend serving both web and mobile frontends.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Presentation Layer                        │
├─────────────────────┬─────────────────────┬─────────────────────┤
│   Web Frontend      │   Mobile App        │   PWA               │
│   (React + Vite)    │   (Flutter)         │                     │
└─────────────────────┴─────────────────────┴─────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway / REST Layer                    │
│                        (Spring Boot)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Business Logic Layer                      │
├─────────────────────┬─────────────────────┬─────────────────────┤
│   Auth Service      │   Program Service   │   Healthcare Svc    │
│   AI Service        │   Location Service  │   Notification Svc  │
│   Application Svc   │                     │                     │
└─────────────────────┴─────────────────────┴─────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Data Access Layer                        │
├─────────────────────┬─────────────────────┬─────────────────────┤
│   JPA Repositories  │   Mongo Repos       │   Cache Layer       │
└─────────────────────┴─────────────────────┴─────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          Data Layer                              │
├─────────────────────┬─────────────────────┬─────────────────────┤
│   PostgreSQL        │   MongoDB           │   Redis (Cache)     │
│   (with PostGIS)    │                     │                     │
└─────────────────────┴─────────────────────┴─────────────────────┘
```

## Component Details

### 1. Frontend Layer

#### Web Frontend (React.js)
- **Framework**: React 18 with Vite
- **State Management**: React Context API
- **Routing**: React Router v6
- **Internationalization**: i18next
- **Voice Features**: Web Speech API
- **Build**: Vite for fast HMR and optimized builds
- **PWA**: Service Workers for offline capability

**Key Features:**
- Responsive design for all screen sizes
- Progressive Web App capabilities
- Voice input/output using Web Speech API
- Multilingual support (EN, ES, HI)
- Geolocation integration
- Real-time search and filtering
- Application submission and tracking

#### Mobile App (Flutter)
- **Framework**: Flutter 3.0+
- **State Management**: Provider
- **Database**: SQLite for offline storage
- **Voice**: speech_to_text & flutter_tts
- **Location**: Geolocator package
- **Notifications**: Firebase Cloud Messaging

**Key Features:**
- Offline-first architecture
- Cross-platform (Android & iOS)
- Native performance
- Voice-driven interaction
- Push notifications
- Material Design UI

### 2. Backend Layer

#### Spring Boot Application

**Core Components:**

1. **Controllers** (REST Endpoints)
   - AuthController: Authentication endpoints
   - ProgramController: Program management
   - HealthcareController: Healthcare facility management
   - AIController: Voice query processing
   - ApplicationController: Application submission and tracking

2. **Services** (Business Logic)
   - AuthService: User authentication and registration
   - ProgramService: Program CRUD operations
   - HealthcareService: Healthcare facility management
   - AIService: NLP processing and query handling
   - ApplicationService: Application submission and tracking

3. **Repositories** (Data Access)
   - UserRepository: User data (PostgreSQL)
   - ProgramRepository: Program data (PostgreSQL)
   - HealthcareFacilityRepository: Healthcare data (PostgreSQL)
   - QueryHistoryRepository: Query logs (MongoDB)
   - ApplicationRepository: Application data (PostgreSQL)

4. **Models** (Domain Objects)
   - User: User entity
   - Program: Government program entity
   - HealthcareFacility: Healthcare facility entity
   - QueryHistory: Query history document
   - Application: Application entity

### 3. Database Layer

#### PostgreSQL (Primary Database)
- **Purpose**: Structured data storage
- **Extensions**: PostGIS for geospatial queries
- **Tables**:
  - users
  - programs
  - healthcare_facilities
  - applications

**Why PostgreSQL?**
- ACID compliance
- Rich query capabilities
- PostGIS extension for geolocation
- Reliable and mature

#### MongoDB (NoSQL Database)
- **Purpose**: Unstructured data and logs
- **Collections**:
  - query_history
  - user_preferences
  - notification_logs

**Why MongoDB?**
- Flexible schema for query logs
- Fast writes for logging
- Easy horizontal scaling
- Good for time-series data

### 4. External Integrations

#### AI/NLP Services
- **OpenAI API**: Advanced natural language processing
- **Hugging Face**: Open-source language models
- **Custom NLP**: Rule-based query processing

#### Geolocation Services
- **OpenCivicData**: Civic data APIs
- **PostGIS**: Spatial queries
- **Browser Geolocation API**: Client-side location

#### Notification Services
- **Firebase Cloud Messaging**: Push notifications
- **AWS SNS**: Alternative notification service

## Data Flow

### 1. User Query Flow

```
User Input (Voice/Text)
    ↓
Frontend Validation
    ↓
API Request to Backend
    ↓
Authentication/Authorization
    ↓
Service Layer Processing
    ↓
AI/NLP Processing (if needed)
    ↓
Database Query
    ↓
Response Formatting
    ↓
Return to Frontend
    ↓
Display + Voice Output (if applicable)
    ↓
Log to MongoDB
```

### 2. Geolocation Query Flow

```
User Request (Find Nearby)
    ↓
Get User Location (GPS/Browser)
    ↓
API Request with Coordinates
    ↓
PostGIS Spatial Query
    ↓
Calculate Distances
    ↓
Sort by Distance
    ↓
Return Results
    ↓
Display on Map/List
```

### 3. Application Submission Flow

```
User Clicks "Apply Now"
    ↓
Navigate to Application Page
    ↓
User Fills Out Form
    ↓
Frontend Validation
    ↓
API Request to Backend
    ↓
Authentication/Authorization
    ↓
Service Layer Processing
    ↓
Database Insert
    ↓
Return Success Response
    ↓
Navigate to "My Applications" Page
```

### 4. Offline Data Sync (Mobile)

```
App Launch
    ↓
Check Connectivity
    ↓
If Online:
  - Fetch Latest Data
  - Update SQLite Cache
  - Sync User Actions
    ↓
If Offline:
  - Load from SQLite
  - Queue User Actions
    ↓
When Online Again:
  - Sync Queued Actions
  - Update Cache
```

## Security Architecture

### Authentication Flow

```
User Login Request
    ↓
Validate Credentials
    ↓
Generate JWT Token
    ↓
Return Token to Client
    ↓
Client Stores Token
    ↓
Subsequent Requests Include Token
    ↓
Backend Validates Token
    ↓
Process Request
```

### Security Measures

1. **Authentication**: JWT-based stateless authentication
2. **Authorization**: Role-based access control (RBAC)
3. **Data Encryption**: HTTPS/TLS for all communications
4. **Input Validation**: Server-side validation for all inputs
5. **SQL Injection Prevention**: Parameterized queries
6. **CORS**: Configured allowed origins
7. **Rate Limiting**: API rate limits per user/IP

## Scalability Considerations

### Horizontal Scaling
- **Backend**: Stateless design allows multiple instances
- **Database**: Read replicas for PostgreSQL
- **MongoDB**: Built-in sharding support

### Caching Strategy
- **Redis**: Cache frequently accessed data
- **Browser Cache**: Static assets
- **SQLite**: Local mobile cache

### Load Balancing
- **API Gateway**: Distribute requests across backend instances
- **Database**: Master-slave replication
- **CDN**: Static asset delivery

## Monitoring and Logging

### Application Monitoring
- **Spring Boot Actuator**: Health checks and metrics
- **Logging**: SLF4J with Logback
- **APM**: Application Performance Monitoring

### Database Monitoring
- **PostgreSQL**: pg_stat_statements
- **MongoDB**: MongoDB Atlas monitoring

### Frontend Monitoring
- **Analytics**: User behavior tracking
- **Error Tracking**: Sentry or similar
- **Performance**: Lighthouse metrics

## Deployment Architecture

### Development Environment
```
Docker Compose
├── PostgreSQL Container
├── MongoDB Container
├── Backend Container
└── Frontend Container
```

### Production Environment
```
Cloud Provider (AWS/GCP/Azure)
├── Load Balancer
├── Backend Cluster (Auto-scaling)
├── RDS PostgreSQL (Multi-AZ)
├── MongoDB Atlas
├── S3/CloudFront (Static Assets)
└── Mobile Apps (App Stores)
```

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Web | React + Vite | User interface |
| Frontend Mobile | Flutter | Cross-platform mobile app |
| Backend API | Spring Boot | REST API server |
| Primary DB | PostgreSQL + PostGIS | Structured data |
| Secondary DB | MongoDB | Logs and documents |
| Authentication | JWT | Stateless auth |
| Caching | Redis | Performance |
| Voice | Web Speech API / Native | Voice I/O |
| Deployment | Docker + Cloud | Containerization |
