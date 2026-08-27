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

Backend service for **Eventful** – a ticketing platform that connects event creators and attendees. Built as a capstone project for the AltSchool Backend Engineering (NodeJS) Diploma Karatu 2025.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Database:** PostgreSQL (Supabase) + Prisma ORM
- **Caching & Rate Limiting:** Redis
- **Payments:** Paystack
- **Authentication:** JWT (access + refresh tokens)
- **Testing:** Jest + Supertest
- **Docs:** Postman / Swagger

## Features

- User authentication & role‑based access (Creator / Attendee)
- Event creation, listing, and management
- QR code ticket generation & verification
- Paystack payment integration
- Customizable event reminders (creator & attendee)
- Analytics dashboard for event creators
- Social media shareability

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL database (local or Supabase)
- Redis instance (local or cloud)
- Paystack test keys

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
   Fill in your DATABASE_URL, JWT_SECRET, PAYSTACK_SECRET_KEY, REDIS_URL, etc.

4. Run database migrations
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server
   ```bash
   npm run dev
   ```

## API Documentation
- Interactive Postman collection: [Link here once deployed]
- Swagger UI <https://eventful-api-311y.onrender.com/api-docs>
  
## Deployment
The API is deployed on render at:
<https://eventful-api-311y.onrender.com>

## Author
- George Owoicho - www.linkedin.com/in/georgetechnmore

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
