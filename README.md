# CivicBridge AI

> Empowering marginalized communities through AI-powered access to civic resources, opportunities, and information.

## 🌟 Overview

CivicBridge AI is a hybrid (web + mobile) application that improves access to resources, opportunities, and information for marginalized communities with a focus on inclusion, accessibility, and real-world impact.

### Key Features

- **Multilingual Support**: Text and voice support in regional languages (English, Spanish, Hindi)
- **Voice-Driven Interaction**: Speech-to-text and text-to-speech for low-literacy users
- **Geolocation Services**: Find nearby healthcare facilities, training centers, and resources
- **Offline Access**: SQLite-based local storage for low-connectivity regions
- **AI-Powered Search**: Natural language processing for intelligent query responses
- **Push Notifications**: Alerts for important deadlines and programs
- **Progressive Web App**: App-like experience in web browsers

## 🏗️ Architecture

```
┌─────────────────────┐       ┌──────────────────┐       ┌─────────────────────────┐
│     Frontend        │──────▶│  Shared Backend  │◀──────│ External Data Sources   │
├─────────────────────┤       ├──────────────────┤       ├─────────────────────────┤
│ Web App (React.js)  │       │ Spring Boot      │       │ Gov APIs (programs)     │
│ Mobile (Flutter)    │──────▶│ REST APIs        │       │ AI APIs (NLP, TTS, STT) │
│ Progressive Web App │       │ PostgreSQL       │       │ GIS APIs                │
└─────────────────────┘       │ MongoDB          │       └─────────────────────────┘
                              └──────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Java 17+ (for backend development)
- Node.js 18+ (for web frontend development)
- Flutter SDK (for mobile development)

### Run with Docker Compose

```bash
# Clone the repository
git clone https://github.com/space0032/CivicBridge-AI.git
cd CivicBridge-AI

# Start all services
docker-compose up -d

# Access the application
# Web: http://localhost
# API: http://localhost:8080/api
```

## 📱 Components

### Backend (Spring Boot)

Located in `/backend`

**Tech Stack:**
- Spring Boot 3.2.0
- PostgreSQL with PostGIS (geospatial queries)
- MongoDB (query history)
- Spring Security with JWT
- Hibernate Spatial

**API Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/programs` - List government programs
- `GET /api/healthcare` - List healthcare facilities
- `GET /api/healthcare/nearby` - Find nearby facilities
- `POST /api/voice-query` - Process voice/text queries

**Run Locally:**
```bash
cd backend
mvn spring-boot:run
```

### Web Frontend (React.js + Vite)

Located in `/frontend-web`

**Tech Stack:**
- React 18
- Vite (build tool)
- React Router (navigation)
- i18next (internationalization)
- Web Speech API (voice features)
- PWA support

**Features:**
- Responsive design
- Voice search capability
- Multilingual interface
- Geolocation integration
- Progressive Web App

**Run Locally:**
```bash
cd frontend-web
npm install
npm run dev
# Access at http://localhost:3000
```

### Mobile App (Flutter)

Located in `/mobile-app`

**Tech Stack:**
- Flutter 3.0+
- Provider (state management)
- SQLite (offline storage)
- speech_to_text & flutter_tts (voice features)
- Geolocator (location services)
- Firebase (push notifications)

**Features:**
- Offline-first architecture
- Voice-driven interaction
- Push notifications
- Material Design UI
- Cross-platform (Android & iOS)

**Run Locally:**
```bash
cd mobile-app
flutter pub get
flutter run
```

## 🎯 Use Cases

### Scenario 1: Rural Farmer
A farmer in a rural area uses voice input to ask: "What government subsidies are available for crops?"
- The app processes the query using NLP
- Returns relevant agricultural programs
- Speaks the response in the farmer's language

### Scenario 2: Student
A student uses the web portal to search for scholarship programs in their region.
- Filters by category (Education) and location
- Views detailed eligibility criteria
- Saves deadline notifications

### Scenario 3: Healthcare Access
A family looks up hospitals offering free vaccination programs for children.
- Uses geolocation to find nearby facilities
- Filters for free services
- Gets directions to the facility

### Scenario 4: Job Seeker
A job seeker searches for skill-building programs in their language.
- Voice or text query in regional language
- AI suggests relevant training programs
- Provides application deadlines and contact info

## 🔧 Configuration

### Security Setup (CRITICAL)

To ensure the application starts correctly and securely, you must configure a strong JWT secret and default admin credentials.

1.  **JWT Secret**: Generate a 512-bit (64-byte) Base64 encoded string.
    *   On Windows (PowerShell): `[Convert]::ToBase64String((1..64 | % { [byte](Read-Host) }))` or similar.
    *   On Linux/macOS: `openssl rand -base64 64`
    *   Set this as `JWT_SECRET` in your `.env` file.

2.  **Default Admin**: Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in your `.env` file. The application will automatically seed this user on first startup.

### Backend Environment Variables (.env)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DB_USERNAME` | PostgreSQL username | `civicbridge` |
| `DB_PASSWORD` | PostgreSQL password | `changeme` |
| `JWT_SECRET` | 512-bit HS512 Secret | (Base64 String) |
| `ADMIN_USERNAME` | Initial admin username | `admin` |
| `ADMIN_PASSWORD` | Initial admin password | `admin123` |
| `OPENAI_API_KEY` | OpenAI key for NLP | `sk-...` |
| `HUGGINGFACE_API_KEY` | HuggingFace key for TTS/STT | `hf_...` |

### Frontend Environment Variables (.env)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend API Base URL | `http://localhost:8080/api` |

## 📚 Documentation

- [API Documentation](docs/API.md) - REST API endpoints and examples
- [Architecture Guide](docs/ARCHITECTURE.md) - System design and components
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions
- [User Guide](docs/USER_GUIDE.md) - End-user documentation

## 🛠️ Development

### Project Structure

```
CivicBridge-AI/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/civicbridge/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── model/
│   │   │   │       └── config/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── Dockerfile
├── frontend-web/            # React web application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── contexts/
│   ├── package.json
│   └── Dockerfile
├── mobile-app/              # Flutter mobile app
│   ├── lib/
│   │   ├── screens/
│   │   ├── widgets/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   └── pubspec.yaml
├── docker-compose.yml
└── README.md
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend-web
npm test
```

### Mobile Tests
```bash
cd mobile-app
flutter test
```

## 🚢 Deployment

### Cloud Deployment Options

**Backend:**
- AWS Elastic Beanstalk
- Google Cloud Run
- Azure App Service

**Database:**
- AWS RDS (PostgreSQL)
- MongoDB Atlas

**Frontend:**
- Vercel
- Netlify
- AWS S3 + CloudFront

**Mobile:**
- Google Play Store (Android)
- Apple App Store (iOS)

See [Deployment Guide](docs/DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## 📄 License

This project is licensed under the MIT License.

## 🌍 Impact

CivicBridge AI aims to:
- Bridge the digital divide for marginalized communities
- Improve access to government programs and civic services
- Enable voice-based interaction for low-literacy users
- Provide offline access in low-connectivity regions
- Support multiple regional languages

## 📞 Support

For support, please open an issue or contact the maintainers.

---

**Built with ❤️ for marginalized communities worldwide**