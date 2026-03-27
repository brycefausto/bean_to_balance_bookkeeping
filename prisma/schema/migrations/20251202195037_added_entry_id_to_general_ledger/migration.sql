/*
  Warnings:

  - You are about to drop the `Entry` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[entryId]` on the table `GeneralLedger` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."APLedger" DROP CONSTRAINT "APLedger_entryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ARLedger" DROP CONSTRAINT "ARLedger_entryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Entry" DROP CONSTRAINT "Entry_bookAccountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Entry" DROP CONSTRAINT "Entry_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Entry" DROP CONSTRAINT "Entry_journalEntryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Entry" DROP CONSTRAINT "Entry_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payroll" DROP CONSTRAINT "Payroll_entryId_fkey";

-- AlterTable
ALTER TABLE "GeneralLedger" ADD COLUMN     "entryId" TEXT;

-- DropTable
DROP TABLE "public"."Entry";

-- CreateTable
CREATE TABLE "EntryLine" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "bookAccountId" TEXT NOT NULL,
    "bookAccountCode" TEXT NOT NULL,
    "debit" DOUBLE PRECISION DEFAULT 0,
    "credit" DOUBLE PRECISION DEFAULT 0,
    "inventoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "postRef" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EntryLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneralLedger_entryId_key" ON "GeneralLedger"("entryId");

-- AddForeignKey
ALTER TABLE "EntryLine" ADD CONSTRAINT "EntryLine_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryLine" ADD CONSTRAINT "EntryLine_bookAccountId_fkey" FOREIGN KEY ("bookAccountId") REFERENCES "BookAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryLine" ADD CONSTRAINT "EntryLine_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryLine" ADD CONSTRAINT "EntryLine_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ARLedger" ADD CONSTRAINT "ARLedger_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "EntryLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "APLedger" ADD CONSTRAINT "APLedger_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "EntryLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "EntryLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralLedger" ADD CONSTRAINT "GeneralLedger_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "EntryLine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
