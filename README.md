# Eventful API
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)]()
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)]()
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)]()
[![Redis](https://img.shields.io/badge/Redis-D92B2B?style=for-the-badge&logo=redis&logoColor=white)]()
[![Paystack](https://img.shields.io/badge/Paystack-00C8A0?style=for-the-badge&logo=paystack&logoColor=white)]()
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)]()
[![Deployed](https://img.shields.io/badge/API-Live-success?style=for-the-badge)]()
[![Coverage](https://img.shields.io/badge/Coverage-90%25-brightgreen?style=for-the-badge)]()
[![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](postman/eventful-api.postman_collection.json)

> **Live API:** [`https://eventful-api-311y.onrender.com`](https://eventful-api-311y.onrender.com)  
> **Health Check:** [`/health`](https://eventful-api-311y.onrender.com/health)

Backend service for **Eventful** – a ticketing platform that connects event creators and attendees. Built as a capstone project for the AltSchool Backend Engineering (NodeJS) Diploma Karatu 2025.


## Features

- **Authentication & Authorization** – JWT access/refresh tokens, role‑based access (`CREATOR` / `USER`)
- **Events CRUD** – Create, read, update, delete events with ownership validation
- **Ticket Purchase** – Paystack integration for secure payments (test mode)
- **QR Code Generation** – Unique QR code per ticket, verification endpoint for event entry
- **Reminders** – Creator‑set global reminders and personal attendee reminders with a flexible delta (e.g., `1d`, `2h`, `30m`)
- **Analytics** – Event‑specific and overall statistics (tickets sold, attendees, revenue)
- **Caching** – In‑memory cache for the public events list (invalidates on mutation)
- **Rate Limiting** – Global (100 req/15 min) and stricter auth limits (10 req/15 min)
- **Shareability** – Events can be shared via structured metadata (open‑graph tags)
- **Input Validation** – Zod schemas on all endpoints
- **Error Handling** – Centralized error middleware with custom application errors
- **API Documentation** – Interactive Postman collection included
- **Integration Tests** – 16 tests across auth, events, and tickets using Jest + Supertest

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js + TypeScript |
| Framework | Express |
| Database | PostgreSQL (Supabase) + Prisma ORM |
| Caching | In‑memory (`node-cache`) |
| Authentication | JWT (access + refresh tokens) |
| Payments | Paystack (test mode) |
| Background Jobs | `node-cron` for reminder checks |
| Testing | Jest, Supertest, Nock |
| Documentation | Postman Collection |
| Deployment | Render |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL database (local or Supabase)
- Paystack test keys
- Redis (optional – not required for basic operation)

### Installation

1. Clone the repo
   ```bash
   git clone https://github.com/devGeorgeOwi/eventful-api.git
   cd eventful-api
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   Fill in your `.env` file with the required variables

   ```bash
   DATABASE_URL="postgresql://user:password@host:port/db?sslmode=require"
   JWT_ACCESS_SECRET="your-access-secret"
   JWT_REFRESH_SECRET="your-refresh-secret"
   JWT_ACCESS_EXPIRES_IN="15m"
   JWT_REFRESH_EXPIRES_IN="7d"
   PAYSTACK_SECRET_KEY="sk_test_..."
   PRISMA_CLIENT_NO_PREPARED_STATEMENTS=true
   ```

4. Run database migrations
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```
5. Start the development server
   ```bash
   npm run dev
   ```
   The server will be available at http://localhost:3000

## API Endpoints

### Base URL: `http://localhost:3000/api`

All protected endpoints require a `Bearer` token in the `Authorization` header.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login | No |
| `POST` | `/auth/refresh` | Refresh access token | No (uses refresh token in body) |
| `GET` | `/events` | List upcoming events (paginated) | No |
| `GET` | `/events/:id` | Get a single event | No |
| `POST` | `/events` | Create an event | `CREATOR` |
| `PUT` | `/events/:id` | Update an event | `CREATOR` (owner) |
| `DELETE` | `/events/:id` | Delete an event | `CREATOR` (owner) |
| `POST` | `/tickets/purchase` | Initiate ticket purchase | Any authenticated user |
| `GET` | `/tickets/verify-payment?reference=` | Verify payment & get ticket | No |
| `GET` | `/tickets/mine` | Get my tickets | Any authenticated user |
| `POST` | `/tickets/scan` | Scan a QR code at entrance | `CREATOR` (event owner) |
| `POST` | `/notifications/events/:id/reminders` | Set a global reminder | `CREATOR` (event owner) |
| `POST` | `/notifications/events/:id/reminders/mine` | Set a personal reminder | Any authenticated user |
| `GET` | `/analytics/events/:id` | Event‑specific analytics | `CREATOR` (event owner) |
| `GET` | `/analytics/overall` | Overall creator analytics | `CREATOR` |
| `GET` | `/health` | Health check | No |

For detailed request/response examples, import the [Postman Collection](postman/eventful-api.postman_collection.json).

## Live API Documentation

🚀 **Swagger UI:** [https://eventful-api-311y.onrender.com](https://eventful-api-311y.onrender.com)

> The root URL automatically redirects to the interactive Swagger UI, where you can test every endpoint.

## Testing

Run the integration test suite:
```bash
npm test
```
Tests cover:

   - Auth – Registration, duplicate emails, login, wrong credentials

   - Events – CRUD operations, authorization checks

   - Tickets – Purchase flow (mocked Paystack), payment verification, QR scanning
  
## Deployment
The API is deployed on Render with the following configuration:

- Build Command: `npm install && npx prisma generate`

- Start Command: `npm run dev`

- Environment Variables: Set in Render dashboard (matching `.env`)

To deploy your own instance:

1. Push the repository to GitHub.

2. Create a new Web Service on Render.

3. Connect the repo and set the environment variables.

4. Deploy.

## Project Structure

---
eventful-api/
├── prisma/                # Schema & migrations
├── src/
│   ├── config/            # Environment validation, Passport setup
│   ├── lib/               # Prisma client singleton, cache
│   ├── common/            # Middleware (auth, error handler, rate limiter)
│   │   ├── errors/        # Custom error classes
│   │   └── middleware/    # Authenticate, authorize, error handler
│   ├── modules/           # Feature‑based modules
│   │   ├── auth/          # Service, controller, routes, validation
│   │   ├── events/        # Service, controller, routes, validation
│   │   ├── tickets/       # Service, controller, routes, validation
│   │   ├── notifications/ # Service, controller, routes, validation
│   │   └── analytics/     # Service, controller, routes
│   ├── cron/              # Reminder cron job
│   ├── app.ts             # Express app configuration
│   └── server.ts          # Server entry point (starts cron)
├── tests/                 # Integration tests
├── postman/               # Postman collection
├── .env.example           # Environment variable template
├── README.md
└── package.json
---

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.