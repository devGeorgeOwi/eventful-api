// This runs before every test suite, ensuring Prisma never uses prepared statements
process.env.PRISMA_CLIENT_NO_PREPARED_STATEMENTS = 'true';