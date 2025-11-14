/*
  Warnings:

  - You are about to drop the `APLedger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ARLedger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bookkeeper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Entry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JournalEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payroll` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vendor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."APLedger" DROP CONSTRAINT "APLedger_entryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."APLedger" DROP CONSTRAINT "APLedger_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ARLedger" DROP CONSTRAINT "ARLedger_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ARLedger" DROP CONSTRAINT "ARLedger_entryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BookAccount" DROP CONSTRAINT "BookAccount_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."BookAccount" DROP CONSTRAINT "BookAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Bookkeeper" DROP CONSTRAINT "Bookkeeper_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Bookkeeper" DROP CONSTRAINT "Bookkeeper_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Company" DROP CONSTRAINT "Company_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Customer" DROP CONSTRAINT "Customer_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Entry" DROP CONSTRAINT "Entry_bookAccountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Entry" DROP CONSTRAINT "Entry_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Entry" DROP CONSTRAINT "Entry_journalEntryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Entry" DROP CONSTRAINT "Entry_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."JournalEntry" DROP CONSTRAINT "JournalEntry_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."JournalEntry" DROP CONSTRAINT "JournalEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Payroll" DROP CONSTRAINT "Payroll_entryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Vendor" DROP CONSTRAINT "Vendor_companyId_fkey";

-- DropTable
DROP TABLE "public"."APLedger";

-- DropTable
DROP TABLE "public"."ARLedger";

-- DropTable
DROP TABLE "public"."Account";

-- DropTable
DROP TABLE "public"."BookAccount";

-- DropTable
DROP TABLE "public"."Bookkeeper";

-- DropTable
DROP TABLE "public"."Company";

-- DropTable
DROP TABLE "public"."Customer";

-- DropTable
DROP TABLE "public"."Entry";

-- DropTable
DROP TABLE "public"."Inventory";

-- DropTable
DROP TABLE "public"."JournalEntry";

-- DropTable
DROP TABLE "public"."Payroll";

-- DropTable
DROP TABLE "public"."Session";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."Vendor";

-- DropTable
DROP TABLE "public"."VerificationToken";

-- DropEnum
DROP TYPE "public"."BalanceType";

-- DropEnum
DROP TYPE "public"."JournalType";

-- DropEnum
DROP TYPE "public"."Role";
