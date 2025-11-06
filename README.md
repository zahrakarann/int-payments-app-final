# IntBank Customer Portal & API

## Project Overview

This is a local React + Node.js banking portal for customers. It includes user registration, login, and payment functionalities. The backend is built with Express.js and MongoDB, while the frontend uses React. This project is designed for campus submission and **runs entirely locally**.

---

## Features

* User registration with secure password hashing and salting.
* Login with JWT authentication.
* Input validation using RegEx whitelists.
* Payments API.
* Protection against common web vulnerabilities (XSS, input injection).
* Local development only, no public deployment.
* CI/CD pipeline with automated tests and linting.

---

## Installation

### Prerequisites

* Node.js v18+
* npm
* MongoDB running locally

### Setup Backend

```bash
cd backend
npm install
```

### Setup Frontend

```bash
cd frontend
npm install
```

---

## Running the Project

### Backend

```bash
cd backend
npm start
```

Server runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm start
```

Frontend runs on `http://localhost:3000`.

### Testing

```bash
cd backend
npm test
```

This runs Jest tests for user authentication and payments.

---

## CI/CD & DevSecOps

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that ensures DevSecOps practices:

* **Automated Linting:** Runs ESLint to enforce code quality.
* **Automated Tests:** Runs backend tests using Jest.
* **Security Awareness:** Workflow encourages checks before merging and highlights test failures.

The CI workflow runs on every push and pull request to the `main` branch.

---

## Security Measures

* Passwords are hashed and salted with bcrypt.
* Input is whitelisted using RegEx for usernames, passwords, account numbers, and IDs.
* Basic XSS protection applied via `xss-clean`.
* Rate limiting applied to prevent brute-force attacks.

> Note: Full SSL and production-level attack protection is not included as the app runs locally for campus submission purposes.

---

## Notes

* This project is for local, academic use only.
* All sensitive keys (JWT_SECRET) are stored in `.env`.

---

## Author

Sandeep Hari

---

## License

[MIT](LICENSE)
