# Contributing to Open Library Management System

Thank you for your interest in contributing to the Open Library Management System! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Release Process](#release-process)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. By participating, you agree to:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences
- Accept responsibility for our words and actions

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js (v14 or higher)
- Docker and Docker Compose
- Git
- A code editor (VS Code recommended)
- Basic knowledge of:
  - JavaScript/Node.js
  - Express.js
  - MongoDB
  - REST APIs

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/lwshakib/book-library-management-api.git
   cd book-library-management-api
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/book-library-management-api.git
   ```

## 🛠️ Development Setup

### 1. Start Development Services

```bash
# Start MongoDB, Redis, and MailHog
docker-compose up -d
```

### 2. Install Dependencies

**Server Dependencies**

```bash
cd server
npm install
```

**Email Service Dependencies**

```bash
cd ../email-service
npm install
```

### 3. Environment Configuration

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

# JWT Secrets (use strong, unique secrets)
ACCESS_TOKEN_SECRET=dev_access_token_secret_change_in_production
REFRESH_TOKEN_SECRET=dev_refresh_token_secret_change_in_production

# Session Secret
EXPRESS_SESSION_SECRET=dev_session_secret_change_in_production

# OAuth Credentials (optional for development)
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

### 4. Start Development Servers

**Terminal 1 - Main Server**

```bash
cd server
npm run dev
```

**Terminal 2 - Email Service**

```bash
cd email-service
npm run dev
```

### 5. Verify Setup

- API Server: http://localhost:3000
- API Documentation: http://localhost:3000/docs
- Health Check: http://localhost:3000/health
- MailHog UI: http://localhost:8025

## 📝 Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

1. **Bug Fixes**: Fix existing issues
2. **Feature Requests**: Propose new features
3. **Documentation**: Improve documentation
4. **Code Improvements**: Refactor, optimize, or enhance existing code
5. **Tests**: Add or improve test coverage
6. **Performance**: Optimize performance
7. **Security**: Enhance security measures

### Before You Start

1. **Check Existing Issues**: Look for existing issues or discussions
2. **Create an Issue**: For significant changes, create an issue first
3. **Discuss**: Engage in discussion before starting work
4. **Assign Yourself**: Assign the issue to yourself if you plan to work on it

## 🔄 Pull Request Process

### 1. Create a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

**Branch Naming Convention:**

- `feature/feature-name` - New features
- `fix/issue-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/component-name` - Code refactoring
- `test/test-description` - Test additions/improvements

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed
- Add tests for new functionality

### 3. Test Your Changes

```bash
# Test the server
cd server
npm run dev

# Test the email service
cd ../email-service
npm run dev

# Test email functionality
# Visit http://localhost:8025 to check MailHog
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

**Commit Message Format:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### 5. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Request review from maintainers

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] Email functionality tested (if applicable)

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Related Issues

Closes #issue_number
```

## 🐛 Issue Reporting

### Before Creating an Issue

1. Search existing issues
2. Check if it's already fixed in the latest version
3. Gather relevant information

### Issue Template

```markdown
## Bug Description

Clear description of the bug

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior

What you expected to happen

## Actual Behavior

What actually happened

## Environment

- OS: [e.g., Windows 10, macOS, Linux]
- Node.js version: [e.g., 16.14.0]
- Browser: [e.g., Chrome 91, Firefox 89]

## Additional Context

Any other relevant information, screenshots, logs, etc.
```

## 🔧 Development Workflow

### Project Structure Understanding

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
│   └── logs/                  # Application logs
├── email-service/             # Email microservice
│   ├── templates/             # Email templates
│   ├── styles/                # Email styling
│   ├── icons/                 # Email icons
│   ├── index.js               # Queue worker
│   └── sendEmail.js           # Email sender
└── docker-compose.yml         # Development services
```

### Key Areas for Contribution

1. **Server (`/server/src/`)**

   - Controllers: Business logic
   - Models: Database schemas
   - Routes: API endpoints
   - Middlewares: Request processing
   - Utils: Helper functions
   - Schema: Input validation

2. **Email Service (`/email-service/`)**

   - Templates: Email HTML templates
   - Styles: Email CSS
   - Icons: Email icons
   - Queue processing: BullMQ workers

3. **Documentation**
   - README files
   - API documentation (Swagger)
   - Code comments
   - Contributing guidelines

## 🎨 Code Style Guidelines

### JavaScript/Node.js Style

- Use ES6+ features
- Use `const` and `let` instead of `var`
- Use arrow functions where appropriate
- Use template literals for string interpolation
- Use async/await instead of Promises where possible

### Naming Conventions

- **Variables**: camelCase (`userName`, `isAuthenticated`)
- **Functions**: camelCase (`getUserById`, `validateInput`)
- **Constants**: UPPER_SNAKE_CASE (`DB_NAME`, `API_VERSION`)
- **Files**: kebab-case (`auth-controllers.js`, `user-model.js`)
- **Classes**: PascalCase (`UserModel`, `ApiError`)

### Code Organization

- One function per file for utilities
- Group related functions in modules
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments for complex functions

### Error Handling

```javascript
// Use asyncHandler for route handlers
export const getUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.json(new ApiResponse(200, user, "User retrieved successfully"));
});
```

### Database Models

```javascript
// Use descriptive schema definitions
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
  },
  {
    timestamps: true,
  }
);
```

## 🧪 Testing Guidelines

### Manual Testing

1. **API Testing**

   - Use Swagger UI: http://localhost:3000/docs
   - Test all endpoints
   - Verify error handling
   - Check response formats

2. **Email Testing**

   - Use MailHog: http://localhost:8025
   - Test all email templates
   - Verify email content
   - Check email delivery

3. **Authentication Testing**
   - Test sign-up/sign-in flow
   - Verify JWT tokens
   - Test OAuth integration
   - Check password reset

### Test Cases to Consider

- **Happy Path**: Normal user flow
- **Edge Cases**: Boundary conditions
- **Error Cases**: Invalid inputs, network failures
- **Security**: Authentication, authorization
- **Performance**: Response times, memory usage

## 📚 Documentation Guidelines

### Code Documentation

- Add JSDoc comments for functions
- Document complex algorithms
- Explain business logic
- Include examples for utility functions

```javascript
/**
 * Validates user input for registration
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @returns {Object} Validation result with success status and errors
 * @example
 * const result = validateUserRegistration({
 *   name: "John Doe",
 *   email: "john@example.com",
 *   password: "securePassword123"
 * });
 */
```

### API Documentation

- Update Swagger documentation for new endpoints
- Include request/response examples
- Document error responses
- Add parameter descriptions

### README Updates

- Update installation instructions
- Add new features to feature list
- Update environment variables
- Include new dependencies

## 🚀 Release Process

### Version Numbering

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version numbers updated
- [ ] Changelog updated
- [ ] Security review completed
- [ ] Performance testing completed

## 🆘 Getting Help

### Resources

- **API Documentation**: http://localhost:3000/docs
- **Project README**: [README.md](README.md)
- **Issues**: GitHub Issues tab
- **Discussions**: GitHub Discussions tab

### Common Issues

1. **Port Already in Use**

   ```bash
   # Kill process using port 3000
   npx kill-port 3000
   ```

2. **MongoDB Connection Issues**

   ```bash
   # Restart MongoDB container
   docker-compose restart mongodb
   ```

3. **Redis Connection Issues**

   ```bash
   # Restart Redis container
   docker-compose restart redis-stack
   ```

4. **Email Service Not Working**
   ```bash
   # Check MailHog container
   docker-compose logs mailhog
   ```

## 🎯 Contribution Ideas

### Good First Issues

- Fix typos in documentation
- Add missing JSDoc comments
- Improve error messages
- Add input validation
- Enhance logging

### Intermediate Issues

- Add new email templates
- Implement new API endpoints
- Add database indexes
- Optimize database queries
- Add caching mechanisms

### Advanced Issues

- Implement new OAuth providers
- Add real-time features
- Optimize performance
- Add monitoring and metrics
- Implement advanced security features

## 📞 Contact

- **Maintainers**: [lwshakib](https://github.com/lwshakib)
- **Issues**: [GitHub Issues](https://github.com/lwshakib/book-library-management-api/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lwshakib/book-library-management-api/discussions)

---

Thank you for contributing to the Open Library Management System! Your contributions help make this project better for everyone. 🎉
