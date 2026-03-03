/**
 * Test setup / preload file.
 * Sets all required environment variables so that modules which read
 * process.env at import-time (e.g. Passport strategies) don't throw.
 *
 * This file is loaded via `bunfig.toml` → [test].preload
 */

process.env.PORT = "0"; // let the OS pick a free port
process.env.NODE_ENV = "test";
process.env.BACKEND_URL = "http://localhost:7000";
process.env.CLIENT_SSO_REDIRECT_URL = "http://localhost:7000";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-google-client-secret";
process.env.GOOGLE_CALLBACK_URL = "http://localhost:7000/auth/google/callback";
process.env.GITHUB_CLIENT_ID = "test-github-client-id";
process.env.GITHUB_CLIENT_SECRET = "test-github-client-secret";
process.env.GITHUB_CALLBACK_URL = "http://localhost:7000/auth/github/callback";
process.env.EXPRESS_SESSION_SECRET = "test-session-secret";
process.env.MONGODB_URI = "mongodb://localhost:27017";
process.env.DB_NAME = "book-library-test";
process.env.ACCESS_TOKEN_SECRET = "test-access-token-secret";
process.env.ACCESS_TOKEN_EXPIRATION = "1d";
process.env.GMAIL_USER = "test@example.com";
process.env.GMAIL_PASS = "test-password";
process.env.MAILHOG_SMTP_HOST = "localhost";
process.env.MAILHOG_SMTP_PORT = "1025";

// Suppress winston logging during tests
import winston from "winston";
winston.configure({
  silent: true,
  transports: [new winston.transports.Console({ silent: true })],
});
