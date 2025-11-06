# SECURITY.md

**Project:** International Payments Portal  
**Authors:** Zahra Karan (ST10358162), Sandeep Hari (ST10050442)  
**Date:** 2025-10-10

---

## Overview
This document outlines the backend security controls and verification tests for the International Payments Portal.  
It demonstrates how the system defends against common web vulnerabilities and enforces secure handling of user and payment data.

---

## Configuration & Secrets
- Secrets are stored only in a local `.env` file (never committed).
- The `.gitignore` ensures `.env` and `.env.test` are ignored.
- Example configuration (`.env.example`):
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/int-payments-app
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
FRONTEND_ORIGIN=http://localhost:3000

SALT_ROUNDS=10 
---

## Key Protections Implemented
### HTTP Hardening
- **Helmet** adds security headers, including CSP and HSTS.
- **HSTS** manually enforced for HTTPS compliance.
- **CORS** restricted to the configured frontend origin.
- **Request Logging** via Morgan for audit trails.

### Authentication & Authorization
- JWT-based authentication (1-hour expiry).
- Protected routes require valid Bearer tokens.
- Unauthorized access returns `401` without exposing details.

### Input Validation & Error Handling
- **express-validator** enforces strict input checks.
- Invalid data returns a structured `400` error.
- Central error handler prevents stack trace leaks.

### Data Protection
- Passwords hashed using **bcrypt** with configured salt rounds.
- No plaintext passwords or secrets in responses.

### Injection & XSS Defenses
- Custom sanitization removes `$` and `.` keys to prevent NoSQLi.
- **xss-clean** sanitizes HTML/script inputs.
- Regex inputs are safely escaped.

### Rate Limiting & Payload Limits
- Rate limit: 200 requests / 15 min per IP.
- JSON payload size capped at 10 KB.

---

## Tests Performed
All tests run locally (`http://localhost:5000`):

1. **Register User** – input validation, bcrypt hash check → ✅ `201 Created`
2. **Login** – credentials + JWT issuance → ✅ `200 OK`
3. **Create Payment (valid)** – stored securely → ✅ `201 Created`
4. **Create Payment (invalid)** – validation rejection → ✅ `400`
5. **Attack Simulation** (`<script>`, `$where`) → sanitized → ✅ `201 Created (safe)`
6. **Get Payments (auth required)** → `200` with token, `401` without → ✅
7. **Rate Limit Test** – repeated logins blocked → ✅
8. **Large Payload** – rejected >10 KB → ✅

---

## Recommendations
- Use a **secrets manager** in production.
- Migrate from deprecated packages (`xss-clean`).
- Add automated security integration tests.
- Enforce HTTPS strictly on deployment platforms.

---

## Contact
For clarifications:
- **Zahra Karan – ST10358162**  
- **Sandeep Hari – ST10050442**


