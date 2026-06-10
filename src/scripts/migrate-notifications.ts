import { prisma } from '../lib/prisma';

async function main() {
  console.log('Creating Reminder table...');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Reminder" (
      "id" TEXT PRIMARY KEY,
      "eventId" TEXT NOT NULL REFERENCES "Event"("id") ON DELETE CASCADE,
      "userId" TEXT REFERENCES "User"("id") ON DELETE CASCADE,
      "timeDelta" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'USER_SET'
    )
  `);

  console.log('Creating unique index on Reminder...');
  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "Reminder_eventId_userId_type_key"
    ON "Reminder"("eventId", "userId", "type")
  `);

  console.log('Creating NotificationLog table...');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "NotificationLog" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
      "eventId" TEXT NOT NULL REFERENCES "Event"("id") ON DELETE CASCADE,
      "message" TEXT NOT NULL,
      "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });