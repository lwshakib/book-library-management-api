# Contributing to Book Library Management System

Thank you for your interest in contributing to the Book Library Management System! This document provides guidelines and information for contributors.

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

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

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
   git clone https://github.com/YOUR_USERNAME/book-library-management-api.git
   cd book-library-management-api
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/lwshakib/book-library-management-api.git
   ```

## 🛠️ Development Setup

### 1. Start Development Services

```bash
# Start MongoDB and MailHog
docker-compose up -d
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and update it:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=7000
BACKEND_URL=http://localhost:7000
CLIENT_SSO_REDIRECT_URL=http://localhost:7000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017
DB_NAME=book-library

# JWT Secrets (use strong, unique secrets)
ACCESS_TOKEN_SECRET=dev_access_token_secret_change_in_production
EXPRESS_SESSION_SECRET=dev_session_secret_change_in_production

# OAuth Credentials (optional for development)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:7000/auth/google/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:7000/auth/github/callback

# Email Configuration
# For development (MailHog)
MAILHOG_SMTP_HOST=localhost
MAILHOG_SMTP_PORT=1025

# For production (Gmail) - Optional for development
GMAIL_USER=your_gmail_username
GMAIL_PASS=your_gmail_app_password
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Verify Setup

- Application: http://localhost:7000
- API Documentation: http://localhost:7000/docs
- Health Check: http://localhost:7000/health
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
8. **UI/UX**: Improve user interface and experience

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
- `style/styling-changes` - UI/CSS changes

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed
- Add tests for new functionality

### 3. Test Your Changes

```bash
# Start the development server
npm run dev

# Test the API using Swagger
# Visit http://localhost:7000/docs

# Test email functionality
# Visit http://localhost:8025 to check MailHog
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

**Commit Message Format:**

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `perf:` - Performance improvements
- `ci:` - CI/CD changes

**Examples:**

```bash
git commit -m "feat: add book search functionality"
git commit -m "fix: resolve authentication token expiration issue"
git commit -m "docs: update API documentation for reviews endpoint"
git commit -m "refactor: simplify email service logic"
```

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

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Testing

- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] Email functionality tested (if applicable)
- [ ] API endpoints tested via Swagger

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Comments added for complex code

## Related Issues

Closes #issue_number
```

## 🐛 Issue Reporting

### Before Creating an Issue

1. Search existing issues to avoid duplicates
2. Check if it's already fixed in the latest version
3. Gather relevant information (logs, screenshots, etc.)

### Bug Report Template

```markdown
## Bug Description

Clear and concise description of the bug

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

- OS: [e.g., Windows 10, macOS, Ubuntu 20.04]
- Node.js version: [e.g., 16.14.0]
- Browser: [e.g., Chrome 91, Firefox 89]
- MongoDB version: [e.g., 5.0]

## Screenshots

If applicable, add screenshots to help explain the problem

## Logs
```

Paste relevant logs here

```

## Additional Context

Any other relevant information
```

### Feature Request Template

```markdown
## Feature Description

Clear description of the feature you'd like to see

## Problem Statement

What problem does this feature solve?

## Proposed Solution

How would you like this feature to work?

## Alternatives Considered

What alternative solutions have you considered?

## Additional Context

Any other context, mockups, or examples
```

## 🔧 Development Workflow

### Project Structure Understanding

```
book-library-management-api/
├── src/
│   ├── controllers/           # Route handlers and business logic
│   ├── models/               # Mongoose database models
│   ├── routes/              # API route definitions
│   ├── middlewares/         # Custom middleware
│   ├── utils/               # Utility functions
│   ├── schema/              # Zod validation schemas
│   ├── logger/              # Logging configuration
│   ├── passport/            # OAuth strategies
│   ├── views/               # EJS templates
│   ├── services/            # Business services
│   ├── seeds/               # Database seeders
│   ├── db/                  # Database configuration
│   ├── data/                # Static data
│   ├── swagger.yaml         # API documentation
│   ├── app.js               # Express app configuration
│   ├── index.js             # Application entry point
│   └── constants.js         # Application constants
├── public/                  # Static assets
├── logs/                    # Application logs
└── docker-compose.yml       # Development services
```

### Key Areas for Contribution

1. **Controllers (`/src/controllers/`)**

   - Business logic for routes
   - Request/response handling
   - Data validation and processing

2. **Models (`/src/models/`)**

   - Database schemas
   - Model methods and virtuals
   - Indexes and validators

3. **Routes (`/src/routes/`)**

   - API endpoint definitions
   - Route middleware
   - Route documentation

4. **Middlewares (`/src/middlewares/`)**

   - Authentication middleware
   - Error handling
   - File upload handling

5. **Utils (`/src/utils/`)**

   - Helper functions
   - Email templates
   - Common utilities

6. **Views (`/src/views/`)**

   - EJS templates
   - Frontend pages
   - Partials and components

7. **Documentation**
   - README files
   - API documentation (Swagger)
   - Code comments
   - Contributing guidelines

## 🎨 Code Style Guidelines

### JavaScript/Node.js Style

- Use ES6+ features (modules, arrow functions, destructuring, etc.)
- Use `const` and `let` instead of `var`
- Use arrow functions where appropriate
- Use template literals for string interpolation
- Use async/await instead of callbacks or raw Promises
- Use optional chaining (`?.`) and nullish coalescing (`??`)

### Naming Conventions

- **Variables**: camelCase (`userName`, `isAuthenticated`)
- **Functions**: camelCase (`getUserById`, `validateInput`)
- **Constants**: UPPER_SNAKE_CASE (`DB_NAME`, `API_VERSION`)
- **Files**: kebab-case (`auth.controllers.js`, `user.model.js`)
- **Classes**: PascalCase (`UserModel`, `ApiError`)
- **Private functions**: prefix with `_` (`_validateToken`)

### Code Organization

- One main export per file for controllers
- Group related functions in modules
- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)
- Add JSDoc comments for complex functions
- Avoid deep nesting (max 3 levels)

### Error Handling

```javascript
// Use asyncHandler for route handlers
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User retrieved successfully"));
});
```

### Database Models

```javascript
import mongoose from "mongoose";

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
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", userSchema);
```

### API Response Format

Always use the `ApiResponse` class for consistent responses:

```javascript
// Success response
return res.status(200).json(new ApiResponse(200, data, "Success message"));

// Error response (use ApiError)
throw new ApiError(400, "Error message");
```

## 🧪 Testing Guidelines

### Manual Testing

1. **API Testing**

   - Use Swagger UI: http://localhost:7000/docs
   - Test all endpoints
   - Verify error handling
   - Check response formats
   - Test with invalid inputs

2. **Email Testing**

   - Use MailHog: http://localhost:8025
   - Test all email templates
   - Verify email content
   - Check email delivery

3. **Authentication Testing**

   - Test sign-up/sign-in flow
   - Verify JWT tokens
   - Test OAuth integration (Google, GitHub)
   - Check password reset flow
   - Test email verification

4. **UI Testing**
   - Test all pages (home, book details, profile, favorites)
   - Verify responsive design
   - Check form validations
   - Test navigation

### Test Cases to Consider

- **Happy Path**: Normal user flow
- **Edge Cases**: Boundary conditions, empty states
- **Error Cases**: Invalid inputs, network failures, database errors
- **Security**: Authentication, authorization, input sanitization
- **Performance**: Response times, pagination, large datasets

## 📚 Documentation Guidelines

### Code Documentation

Add JSDoc comments for functions:

```javascript
/**
 * Validates user input for registration
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @returns {Object} Validation result with success status and errors
 * @throws {ApiError} If validation fails
 * @example
 * const result = validateUserRegistration({
 *   name: "John Doe",
 *   email: "john@example.com",
 *   password: "securePassword123"
 * });
 */
```

### API Documentation

- Update Swagger documentation (`src/swagger.yaml`) for new endpoints
- Include request/response examples
- Document error responses
- Add parameter descriptions
- Include authentication requirements

### README Updates

- Update installation instructions for new dependencies
- Add new features to feature list
- Update environment variables
- Include new API endpoints
- Update screenshots if UI changes

## 🎯 Contribution Ideas

### Good First Issues

- Fix typos in documentation
- Add missing JSDoc comments
- Improve error messages
- Add input validation
- Enhance logging
- Improve UI styling

### Intermediate Issues

- Add new email templates
- Implement new API endpoints
- Add database indexes
- Optimize database queries
- Add caching mechanisms
- Improve error handling

### Advanced Issues

- Implement new OAuth providers (Facebook, Twitter)
- Add real-time features (WebSockets)
- Optimize performance
- Add monitoring and metrics
- Implement advanced security features
- Add comprehensive test suite
- Implement CI/CD pipeline

## 🆘 Getting Help

### Resources

- **API Documentation**: http://localhost:7000/docs
- **Project README**: [README.md](README.md)
- **Issues**: [GitHub Issues](https://github.com/lwshakib/book-library-management-api/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lwshakib/book-library-management-api/discussions)

### Common Issues

1. **Port Already in Use**

   ```bash
   # Windows
   netstat -ano | findstr :7000
   taskkill /PID <PID> /F

   # Linux/Mac
   lsof -ti:7000 | xargs kill -9
   ```

2. **MongoDB Connection Issues**

   ```bash
   # Restart MongoDB container
   docker-compose restart mongodb

   # Check MongoDB logs
   docker-compose logs mongodb
   ```

3. **Email Service Not Working**

   ```bash
   # Check MailHog container
   docker-compose logs mailhog

   # Restart MailHog
   docker-compose restart mailhog
   ```

4. **Module Not Found Errors**

   ```bash
   # Reinstall dependencies
   rm -rf node_modules
   npm install
   ```

## 📞 Contact

- **Maintainer**: [lwshakib](https://github.com/lwshakib)
- **Issues**: [GitHub Issues](https://github.com/lwshakib/book-library-management-api/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lwshakib/book-library-management-api/discussions)

## 🙏 Thank You

Thank you for contributing to the Book Library Management System! Your contributions help make this project better for everyone. 🎉

---

**Happy Coding! 💻**
