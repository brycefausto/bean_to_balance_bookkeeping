import {
  PrismaClient,
  AccountType,
  NormalSide,
  JournalType,
  LedgerCategory,
  Role,
} from "@prisma/client";
import chartOfAccountsJSON from "./json/chart_of_accounts.json";
import { hashPassword } from "@/lib/password.utils";

// ------------------------------------------------------
// Map JSON chart_of_accounts type → Prisma enum values
// ------------------------------------------------------
function mapAccountType(type: string) {
  switch (type) {
    case "ASSET":
      return { accountType: AccountType.ASSET, normalSide: NormalSide.DEBIT };
    case "CONTRA-ASSET":
      return { accountType: AccountType.ASSET, normalSide: NormalSide.CREDIT };
    case "LIABILITY":
      return {
        accountType: AccountType.LIABILITY,
        normalSide: NormalSide.CREDIT,
      };
    case "EQUITY":
    case "EQUITY (TEMPORARY)":
      return { accountType: AccountType.EQUITY, normalSide: NormalSide.CREDIT };
    case "CONTRA-EQUITY":
      return { accountType: AccountType.EQUITY, normalSide: NormalSide.DEBIT };
    case "REVENUE":
      return {
        accountType: AccountType.REVENUE,
        normalSide: NormalSide.CREDIT,
      };
    case "CONTRA-REVENUE":
      return { accountType: AccountType.REVENUE, normalSide: NormalSide.DEBIT };
    case "EXPENSE":
    case "EXPENSE ":
      return { accountType: AccountType.EXPENSE, normalSide: NormalSide.DEBIT };
    case "CONTRA-EXPENSE":
      return {
        accountType: AccountType.EXPENSE,
        normalSide: NormalSide.CREDIT,
      };
    default:
      throw new Error("Unknown account type: " + type);
  }
}

export async function seedBookkeepingData(prisma: PrismaClient) {
  console.log("🌱 Seeding database…");

  // ------------------------------------------------------------------
  // Helper: Create JE + EntryLine + General Ledger (and return lines)
  // ------------------------------------------------------------------
  async function createJE({
    userId,
    companyId,
    date,
    description,
    accountsMap,
    entries,
  }: {
    userId: string;
    companyId: string;
    date: Date;
    description: string;
    accountsMap: Record<string, any>;
    entries: any[];
  }) {
    const journal = await prisma.journalEntry.create({
      data: {
        companyId,
        date,
        description,
        journalType: JournalType.GENERAL,
        userId,
      },
    });

    const entryLines = [];

    for (const e of entries) {
      const account = accountsMap[String(e.code)];
      if (!account) throw new Error("Account not found: " + e.code);

      const line = await prisma.entryLine.create({
        data: {
          journalEntryId: journal.id,
          date,
          bookAccountId: account.id,
          bookAccountCode: String(e.code),
          debit: e.debit ?? 0,
          credit: e.credit ?? 0,
          userId,
        },
      });

      entryLines.push(line);

      await prisma.generalLedger.create({
        data: {
          date,
          item: description,
          postRef: journal.id,
          debit: e.debit ?? 0,
          credit: e.credit ?? 0,
          balance: 0,
          ledgerCategory: LedgerCategory.JOURNAL_ENTRY,
          bookAccountId: account.id,
        },
      });
    }

    return { journal, entryLines };
  }

  // -------------------------------------
  // Create User + Company + Bookkeeper
  // -------------------------------------
  const owner = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@testmail.com",
      password: await hashPassword("ownerpass123"),
      role: Role.OWNER,
    },
  });
  const company = await prisma.company.create({
    data: {
      name: "Brew Haven Café",
      email: "info@brewhaven.com",
      phone: "09171234567",
      address: "Katipunan, QC",
      user: {
        connect: { id: owner.id },
      },
    },
  });

  const bookkeeper = await prisma.user.create({
    data: {
      name: "Jane Doe",
      email: "jane@testmail.com",
      password: await hashPassword("bkpass12345"),
      role: Role.BOOKKEEPER,
    },
  });

  // -------------------------------------
  // 3. Insert accounts into BookAccount
  // -------------------------------------
  const accountsMap: Record<string, any> = {};

  for (const acc of chartOfAccountsJSON) {
    const { accountType, normalSide } = mapAccountType(acc.type);

    const created = await prisma.bookAccount.create({
      data: {
        code: String(acc.code),
        name: acc.name,
        description: acc.description,
        financialReport: acc.financialReport,
        accountType,
        normalSide,
        companyId: company.id,
        userId: bookkeeper.id,
      },
    });

    accountsMap[String(acc.code)] = created;
  }

  // -------------------------------------
  // 4. Vendors & Customers
  // -------------------------------------
  await prisma.vendor.createMany({
    data: [
      { name: "ABC Coffee Beans Supplier", companyId: company.id },
      { name: "Fresh Dairy Co.", companyId: company.id },
      { name: "Paper Goods Trading", companyId: company.id },
    ],
  });

  await prisma.customer.createMany({
    data: [
      { name: "Juan Dela Cruz", companyId: company.id },
      { name: "Maria Santos", companyId: company.id },
    ],
  });

  // -------------------------------------
  // 5. Insert Inventory Items
  // -------------------------------------
  const invBeans = await prisma.inventory.create({
    data: {
      itemName: "Arabica Beans 1kg",
      sku: "BEANS-1KG",
      quantity: 20,
      cost: 600,
      companyId: company.id,
    },
  });

  const invMilk = await prisma.inventory.create({
    data: {
      itemName: "Milk Gallon",
      sku: "MILK-GL",
      quantity: 10,
      cost: 250,
      companyId: company.id,
    },
  });

  const invPastry = await prisma.inventory.create({
    data: {
      itemName: "Croissant Dough Pack",
      sku: "DOUGH-CR",
      quantity: 15,
      cost: 150,
      companyId: company.id,
    },
  });

  // -------------------------------------
  // 6. Beginning Balances
  // -------------------------------------
  await createJE({
    userId: bookkeeper.id,
    companyId: company.id,
    date: new Date("2025-01-01"),
    description: "Beginning Balances",
    accountsMap,
    entries: [
      { code: 111, debit: 50000 }, // Cash
      { code: 115, debit: 10000 }, // Inventory
      { code: 311, credit: 60000 }, // Capital
    ],
  });

  // -----------------------------------------------
  // 7. Purchases (Inventory increases)
  // -----------------------------------------------

  // Coffee beans ON ACCOUNT
  await createJE({
    userId: bookkeeper.id,
    companyId: company.id,
    date: new Date("2025-01-05"),
    description: "Purchase - Coffee Beans",
    accountsMap,
    entries: [
      { code: 115, debit: 5000 }, // Merchandise Inventory
      { code: 211, credit: 5000 }, // Accounts Payable
    ],
  });

  // Pastry supplies (cash)
  await createJE({
    userId: bookkeeper.id,
    companyId: company.id,
    date: new Date("2025-01-06"),
    description: "Purchase - Pastry Supplies",
    accountsMap,
    entries: [
      { code: 115, debit: 1800 },
      { code: 111, credit: 1800 },
    ],
  });

  // -----------------------------------------------
  // 8. Sales transaction (with inventory usage)
  // -----------------------------------------------
  const sale = await createJE({
    userId: bookkeeper.id,
    companyId: company.id,
    date: new Date("2025-01-07"),
    description: "Sales - Coffee & Pastry",
    accountsMap,
    entries: [
      { code: 111, debit: 3500 }, // Cash
      { code: 411, credit: 2500 }, // Sales
      { code: 412, credit: 1000 }, // Other income
    ],
  });

  // Link sold items to EntryLines (inventory consumption)
  await prisma.inventory.update({
    where: { id: invBeans.id },
    data: {
      salesEntries: { connect: { id: sale.entryLines[0].id } }, // Coffee sale
    },
  });

  // Reduce stock (custom inventory deduction engine can be added later)
  await prisma.inventory.update({
    where: { id: invBeans.id },
    data: {
      quantity: { decrement: 2 },
    },
  });

  // COGS
  await createJE({
    userId: bookkeeper.id,
    companyId: company.id,
    date: new Date("2025-01-07"),
    description: "COGS - Goods Sold",
    accountsMap,
    entries: [
      { code: 511, debit: 1200 }, // Purchases Expense / COGS
      { code: 115, credit: 1200 }, // Reduce inventory
    ],
  });

  // -----------------------------------------------
  // 9. Rent + Utilities
  // -----------------------------------------------
  await createJE({
    userId: bookkeeper.id,
    companyId: company.id,
    date: new Date("2025-01-08"),
    description: "Rent Expense",
    accountsMap,
    entries: [
      { code: 603, debit: 15000 },
      { code: 111, credit: 15000 },
    ],
  });

  await createJE({
    userId: bookkeeper.id,
    companyId: company.id,
    date: new Date("2025-01-09"),
    description: "Utilities Expense",
    accountsMap,
    entries: [
      { code: 604, debit: 3000 },
      { code: 111, credit: 3000 },
    ],
  });

  // -----------------------------------------------
  // 10. Payroll (using new Payroll model)
  // -----------------------------------------------
  const payrollEntry = await createJE({
    userId: bookkeeper.id,
    companyId: company.id,
    date: new Date("2025-01-10"),
    description: "Payroll - Barista",
    accountsMap,
    entries: [
      { code: 601, debit: 8000 },
      { code: 111, credit: 8000 },
    ],
  });

  // Link to Payroll table
  await prisma.payroll.create({
    data: {
      employee: "John Barista",
      grossPay: 8500,
      netPay: 8000,
      date: new Date("2025-01-10"),
      entryId: payrollEntry.entryLines[0].id,
      companyId: company.id,
    },
  });

  console.log("🌱 Seed completed successfully!");
}
