/*
  Warnings:

  - You are about to drop the column `ticketId` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "ticketId",
ALTER COLUMN "status" SET DEFAULT 'pending';
