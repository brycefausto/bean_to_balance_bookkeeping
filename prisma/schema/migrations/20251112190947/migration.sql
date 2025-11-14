/*
  Warnings:

  - The values [ASSETS,LIABILITIES,OWNERS_EQUITY,REVENUE,PURCHASES,EXPENSES] on the enum `LedgerCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `balanceType` on the `BookAccount` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `BookAccount` table. All the data in the column will be lost.
  - You are about to drop the column `balanceType` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `GeneralLedger` table. All the data in the column will be lost.
  - Added the required column `accountType` to the `BookAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `normalSide` to the `BookAccount` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE');

-- CreateEnum
CREATE TYPE "NormalSide" AS ENUM ('DEBIT', 'CREDIT', 'ANY');

-- AlterEnum
BEGIN;
CREATE TYPE "LedgerCategory_new" AS ENUM ('JOURNAL_ENTRY', 'ADJUSTMENT', 'CLOSING');
ALTER TABLE "GeneralLedger" ALTER COLUMN "ledgerCategory" TYPE "LedgerCategory_new" USING ("ledgerCategory"::text::"LedgerCategory_new");
ALTER TYPE "LedgerCategory" RENAME TO "LedgerCategory_old";
ALTER TYPE "LedgerCategory_new" RENAME TO "LedgerCategory";
DROP TYPE "public"."LedgerCategory_old";
COMMIT;

-- AlterTable
ALTER TABLE "BookAccount" DROP COLUMN "balanceType",
DROP COLUMN "type",
ADD COLUMN     "accountType" "AccountType" NOT NULL,
ADD COLUMN     "normalSide" "NormalSide" NOT NULL;

-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "balanceType",
ALTER COLUMN "debit" DROP NOT NULL,
ALTER COLUMN "credit" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GeneralLedger" DROP COLUMN "updatedAt",
ALTER COLUMN "debit" SET DEFAULT 0,
ALTER COLUMN "credit" SET DEFAULT 0,
ALTER COLUMN "balance" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "JournalEntry" ADD COLUMN     "posted" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "public"."BalanceType";
