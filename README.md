# Open Library Management System

A comprehensive full-stack digital library management system built with Node.js, featuring user authentication, book management, reviews, favorites, and a robust email notification system.

## 🚀 Features

### Core Functionality

- **User Management**: Registration, authentication, email verification, password reset
- **Book Management**: CRUD operations for books with cover image uploads
- **Review System**: User reviews and ratings for books
- **Favorites**: Personal bookmark system for users
- **Search & Filter**: Advanced book search with filtering and sorting
- **Admin Panel**: Administrative controls for book and user management

### Authentication & Security

- **JWT Authentication**: Secure token-based authentication
- **OAuth Integration**: Google and GitHub OAuth2 support
- **Email Verification**: Email-based account verification
- **Password Security**: bcrypt hashing with secure password reset
- **Rate Limiting**: Protection against abuse and DDoS attacks
- **Session Management**: Secure session handling

### Email System

- **Queue-based Processing**: Reliable email delivery using BullMQ
- **Multiple Templates**: Welcome, verification, password reset, security alerts
- **Development Support**: MailHog integration for testing
- **Production Ready**: Gmail SMTP support for production

### API & Documentation

- **RESTful API**: Well-structured REST endpoints
- **Swagger Documentation**: Interactive API documentation
- **Input Validation**: Zod schema validation
- **Error Handling**: Comprehensive error management
- **Logging**: Detailed application and HTTP logging

## 🏗️ Architecture

This project follows a microservices architecture with the following components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   Server API    │    │  Email Service  │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Microservice)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Databases     │
                       │ MongoDB + Redis │
                       └─────────────────┘
```

## 📁 Project Structure

```
book-library-management-api/
├── server/                     # Main API server
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── middlewares/       # Custom middleware
│   │   ├── utils/             # Utility functions
│   │   ├── schema/            # Validation schemas
│   │   ├── logger/            # Logging configuration
│   │   ├── passport/          # OAuth strategies
│   │   ├── views/             # EJS templates
│   │   └── swagger.yaml       # API documentation
│   ├── logs/                  # Application logs
│   └── package.json
├── email-service/             # Email microservice
│   ├── templates/             # Email templates
│   ├── styles/                # Email styling
│   ├── icons/                 # Email icons
│   ├── index.js               # Queue worker
│   ├── sendEmail.js           # Email sender
│   └── package.json
├── docker-compose.yml         # Development services
├── .gitignore
├── .dockerignore
└── README.md
```

## 🛠️ Tech Stack

### Backend (Server)

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Passport.js (Google, GitHub OAuth)
- **Validation**: Zod schema validation
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston + Morgan
- **Security**: bcryptjs, express-rate-limit, CORS

### Email Service

- **Queue System**: BullMQ with Redis
- **Email Provider**: Nodemailer
- **Templates**: Custom HTML email templates
- **Development**: MailHog for testing
- **Production**: Gmail SMTP

### Infrastructure

- **Database**: MongoDB
- **Cache/Queue**: Redis
- **Email Testing**: MailHog
- **Containerization**: Docker Compose
- **Development**: Nodemon for hot reloading

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/lwshakib/book-library-management-api.git
   cd book-library-management-api
   ```

2. **Start development services**

   ```bash
   # Start MongoDB, Redis, and MailHog
   docker-compose up -d
   ```

3. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

4. **Install email service dependencies**

   ```bash
   cd ../email-service
   npm install
   ```

5. **Set up environment variables**

   Create `.env` files in both `server/` and `email-service/` directories:

   **server/.env**

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   BACKEND_URL=http://localhost:3000
   CLIENT_SSO_REDIRECT_URL=http://localhost:3000

   # Database
   MONGODB_URI=mongodb://localhost:27017

   # JWT Secrets
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret

   # Session Secret
   EXPRESS_SESSION_SECRET=your_session_secret

   # OAuth Credentials
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

   **email-service/.env**

   ```env
   # Email Service Configuration
   NODE_ENV=development
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # Development (MailHog)
   MAILHOG_SMTP_HOST=localhost
   MAILHOG_SMTP_PORT=1025

   # Production (Gmail) - Optional for development
   GMAIL_USER=your_gmail_username
   GMAIL_PASS=your_gmail_app_password
   ```

6. **Start the services**

   **Terminal 1 - Start the main server**

   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Start the email service**

   ```bash
   cd email-service
   npm run dev
   ```

7. **Access the application**
   - **API Server**: http://localhost:3000
   - **API Documentation**: http://localhost:3000/docs
   - **Health Check**: http://localhost:3000/health
   - **MailHog UI**: http://localhost:8025 (for email testing)

## 📚 API Documentation

### Authentication Endpoints

- `POST /auth/sign-up` - User registration
- `POST /auth/sign-in` - User login
- `POST /auth/sign-out` - User logout
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/forget-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/verify-email` - Verify email address
- `GET /auth/google` - Google OAuth login
- `GET /auth/github` - GitHub OAuth login

### Book Management

- `GET /books` - Get all books (with pagination, filtering, sorting)
- `GET /books/:id` - Get book by ID
- `POST /books` - Create new book (Admin only)
- `PUT /books/:id` - Update book (Admin only)
- `DELETE /books/:id` - Delete book (Admin only)
- `POST /books/:id/upload-image` - Upload book cover image

### Reviews & Favorites

- `GET /reviews` - Get all reviews
- `GET /reviews/book/:bookId` - Get reviews for a book
- `POST /reviews` - Create new review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review
- `GET /favorites` - Get user's favorite books
- `POST /favorites` - Add book to favorites
- `DELETE /favorites/:bookId` - Remove book from favorites

For complete API documentation, visit: http://localhost:3000/docs

## 🔧 Development

### Available Scripts

**Server**

```bash
npm start          # Start production server
npm run dev        # Start development server with hot reload
```

**Email Service**

```bash
npm start          # Start email worker
npm run dev        # Start email worker with hot reload
```

### Database Seeding

To populate the database with sample books:

```bash
# Make a POST request to the seeding endpoint (requires admin authentication)
curl -X POST http://localhost:3000/seeds/add-books \
  -H "Authorization: Bearer <admin_jwt_token>"
```

### Code Style

The project uses Prettier for code formatting:

- Configuration: `.prettierc.yaml`
- Ignore file: `.prettierignore`

### Logging

- **Winston**: Application-level logging (info, error, debug)
- **Morgan**: HTTP request logging
- Log files are stored in the `server/logs/` directory

## 🐳 Docker Services

The project includes Docker Compose for easy development setup:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild services
docker-compose up -d --build
```

**Services included:**

- **MongoDB**: Database server (port 27017)
- **Redis Stack**: Cache and queue server (ports 6379, 8001)
- **MailHog**: Email testing server (ports 1025, 8025)

## 🔒 Security Features

- **Rate Limiting**: 5000 requests per 15 minutes per IP
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Zod schema validation for all inputs
- **Session Management**: Secure session handling with Passport.js
- **Email Verification**: Email-based account verification
- **OAuth Integration**: Secure third-party authentication

## 📧 Email System

The email service provides:

- **Queue-based Processing**: Reliable email delivery using BullMQ
- **Multiple Templates**: Welcome, verification, password reset, security alerts
- **Development Support**: MailHog integration for testing
- **Production Ready**: Gmail SMTP support for production
- **Retry Logic**: Automatic retry with exponential backoff
- **Concurrent Processing**: Configurable concurrency for email workers

## 🧪 Testing

### Email Testing (Development)

1. Start MailHog: `docker-compose up -d mailhog`
2. Access MailHog UI: http://localhost:8025
3. Trigger email actions in the application
4. View sent emails in MailHog interface

### API Testing

Use the Swagger UI at http://localhost:3000/docs for interactive API testing.

## 🚀 Deployment

### Production Environment Variables

**Server**

```env
NODE_ENV=production
MONGODB_URI=mongodb://your-mongodb-uri
REDIS_HOST=your-redis-host
REDIS_PORT=6379
ACCESS_TOKEN_SECRET=your-secure-secret
REFRESH_TOKEN_SECRET=your-secure-secret
EXPRESS_SESSION_SECRET=your-secure-secret
```

**Email Service**

```env
NODE_ENV=production
REDIS_HOST=your-redis-host
REDIS_PORT=6379
GMAIL_USER=your-gmail-username
GMAIL_PASS=your-gmail-app-password
```

### Production Considerations

- Use a production MongoDB instance
- Set up Redis for caching and queuing
- Configure Gmail SMTP for email delivery
- Set up proper logging and monitoring
- Use environment-specific secrets
- Configure proper CORS origins
- Set up SSL/TLS certificates

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed guidelines.

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [API Documentation](http://localhost:3000/docs)
2. Review the logs in `server/logs/`
3. Check the MailHog interface for email issues
4. Open an issue on GitHub

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
  - User authentication and management
  - Book CRUD operations
  - Review and favorites system
  - Email notification service
  - OAuth integration
  - API documentation

---

**Built with ❤️ using Node.js, Express, MongoDB, Redis, and BullMQ**
