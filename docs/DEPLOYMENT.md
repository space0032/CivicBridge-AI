# Deployment Guide

## Prerequisites

- Docker and Docker Compose
- Cloud provider account (AWS, GCP, or Azure)
- Domain name (optional but recommended)
- SSL certificate

## Local Development Deployment

### Using Docker Compose

1. Clone the repository:
```bash
git clone https://github.com/space0032/CivicBridge-AI.git
cd CivicBridge-AI
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start services:
```bash
docker-compose up -d
```

4. Access the application:
- Web: http://localhost
- API: http://localhost:8080/api

5. Stop services:
```bash
docker-compose down
```

## Production Deployment

### Backend Deployment (AWS Example)

#### Option 1: AWS Elastic Beanstalk

1. Install AWS CLI and EB CLI:
```bash
pip install awscli awsebcli
```

2. Initialize EB application:
```bash
cd backend
eb init -p java-17 civicbridge-backend
```

3. Create environment:
```bash
eb create civicbridge-prod
```

4. Configure environment variables:
```bash
eb setenv DB_USERNAME=your_db_user \
  DB_PASSWORD=your_db_password \
  JWT_SECRET=your_jwt_secret \
  OPENAI_API_KEY=your_openai_key
```

5. Deploy:
```bash
eb deploy
```

#### Option 2: Docker on EC2

1. Launch EC2 instance (Ubuntu 22.04 LTS)

2. Install Docker:
```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo usermod -aG docker $USER
```

3. Clone and deploy:
```bash
git clone https://github.com/space0032/CivicBridge-AI.git
cd CivicBridge-AI/backend
docker build -t civicbridge-backend .
docker run -d -p 8080:8080 \
  -e DB_USERNAME=your_db_user \
  -e DB_PASSWORD=your_db_password \
  civicbridge-backend
```

### Database Deployment

#### PostgreSQL on AWS RDS

1. Create RDS instance:
```bash
aws rds create-db-instance \
  --db-instance-identifier civicbridge-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username civicbridge \
  --master-user-password your_password \
  --allocated-storage 20
```

2. Enable PostGIS extension:
```sql
CREATE EXTENSION postgis;
```

#### MongoDB Atlas

1. Create cluster at https://cloud.mongodb.com
2. Configure IP whitelist
3. Create database user
4. Get connection string
5. Update backend configuration

### Frontend Web Deployment

#### Option 1: Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd frontend-web
vercel --prod
```

3. Configure environment variables in Vercel dashboard:
```
VITE_API_URL=https://api.your-domain.com/api
```

#### Option 2: AWS S3 + CloudFront

1. Build the application:
```bash
cd frontend-web
npm run build
```

2. Create S3 bucket:
```bash
aws s3 mb s3://civicbridge-web
```

3. Upload files:
```bash
aws s3 sync dist/ s3://civicbridge-web
```

4. Configure S3 for static hosting:
```bash
aws s3 website s3://civicbridge-web \
  --index-document index.html \
  --error-document index.html
```

5. Create CloudFront distribution:
```bash
aws cloudfront create-distribution \
  --origin-domain-name civicbridge-web.s3.amazonaws.com
```

#### Option 3: Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
cd frontend-web
npm run build
netlify deploy --prod --dir=dist
```

### Mobile App Deployment

#### Android (Google Play Store)

1. Build release APK:
```bash
cd mobile-app
flutter build apk --release
```

2. Or build App Bundle:
```bash
flutter build appbundle --release
```

3. Sign the app:
```bash
jarsigner -verbose -sigalg SHA256withRSA \
  -digestalg SHA-256 \
  -keystore my-release-key.jks \
  app-release.apk alias_name
```

4. Upload to Google Play Console:
- Go to https://play.google.com/console
- Create new application
- Upload APK/AAB
- Fill in store listing
- Submit for review

#### iOS (Apple App Store)

1. Build iOS app:
```bash
cd mobile-app
flutter build ios --release
```

2. Open in Xcode:
```bash
open ios/Runner.xcworkspace
```

3. Archive and upload:
- Product → Archive
- Distribute App
- Upload to App Store Connect

4. Submit in App Store Connect:
- Go to https://appstoreconnect.apple.com
- Fill in app information
- Submit for review

## SSL/TLS Configuration

### Using Let's Encrypt (Free)

1. Install Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
```

2. Obtain certificate:
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

3. Auto-renewal:
```bash
sudo certbot renew --dry-run
```

## Environment Variables

### Backend (.env)

```bash
# Database
DB_USERNAME=civicbridge
DB_PASSWORD=secure_password
DB_HOST=localhost
DB_PORT=5432
MONGODB_URI=mongodb://localhost:27017/civicbridge

# JWT
JWT_SECRET=your_very_long_and_secure_secret_key

# AI Services
OPENAI_API_KEY=sk-...
HUGGINGFACE_API_KEY=hf_...

# Geolocation
GEO_API_KEY=your_geo_api_key

# Firebase
FIREBASE_CREDENTIALS=/path/to/firebase-credentials.json

# AWS (for notifications)
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key
AWS_REGION=us-east-1

# CORS
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### Frontend (.env)

```bash
VITE_API_URL=https://api.your-domain.com/api
```

## Monitoring and Logging

### Application Monitoring

1. Spring Boot Actuator endpoints:
```
/actuator/health
/actuator/metrics
/actuator/info
```

2. Set up monitoring service (e.g., Prometheus + Grafana)

### Log Management

1. Configure centralized logging (e.g., ELK Stack)

2. Application logs location:
```
Backend: /var/log/civicbridge/
Frontend: Browser console / Sentry
```

## Backup Strategy

### Database Backups

#### PostgreSQL
```bash
# Daily backup
pg_dump -h localhost -U civicbridge civicbridge > backup_$(date +%Y%m%d).sql

# Restore
psql -h localhost -U civicbridge civicbridge < backup_20240115.sql
```

#### MongoDB
```bash
# Backup
mongodump --uri="mongodb://localhost:27017/civicbridge" --out=/backup

# Restore
mongorestore --uri="mongodb://localhost:27017/civicbridge" /backup/civicbridge
```

### Automated Backups

Set up cron jobs:
```bash
# Daily PostgreSQL backup at 2 AM
0 2 * * * /usr/local/bin/backup-postgres.sh

# Daily MongoDB backup at 3 AM
0 3 * * * /usr/local/bin/backup-mongo.sh
```

## Scaling

### Horizontal Scaling

1. Use load balancer (AWS ELB, Nginx)
2. Run multiple backend instances
3. Configure auto-scaling groups

### Database Scaling

1. Set up read replicas
2. Implement connection pooling
3. Use caching layer (Redis)

## Health Checks

### Backend Health Check
```bash
curl http://localhost:8080/actuator/health
```

### Database Health Check
```bash
# PostgreSQL
pg_isready -h localhost -p 5432

# MongoDB
mongo --eval "db.adminCommand('ping')"
```

## Rollback Procedure

### Backend Rollback

1. Using Elastic Beanstalk:
```bash
eb use civicbridge-prod
eb deploy --version previous-version
```

2. Using Docker:
```bash
docker pull civicbridge-backend:previous-tag
docker stop civicbridge-backend
docker run civicbridge-backend:previous-tag
```

### Frontend Rollback

1. Vercel:
```bash
vercel rollback
```

2. S3:
```bash
aws s3 sync s3://civicbridge-backup/ s3://civicbridge-web/
```

## Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check database credentials
   - Verify security group/firewall rules
   - Ensure database is running

2. **API not responding**
   - Check backend logs
   - Verify environment variables
   - Check server resources

3. **Mobile app crashes**
   - Check crash reports (Firebase Crashlytics)
   - Verify API compatibility
   - Test on different devices

### Support

For deployment support, please open an issue on GitHub.
