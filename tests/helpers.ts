import { prisma } from '../src/lib/prisma';

export async function clearDatabase() {
  // Delete in order to respect foreign keys
  await prisma.ticket.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
}