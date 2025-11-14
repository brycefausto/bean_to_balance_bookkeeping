import { GeneralLedgerView } from "@/interfaces/general-ledger.dto";
import { AccountType, BookAccount } from "@prisma/client";
import { create } from "zustand";

export interface FinancialStatements {
  balanceSheet: BalanceSheet;
  incomeStatement: IncomeStatement;
  cashFlow: CashFlowStatement;
  equityStatement: EquityStatement;
}

export interface BalanceSheet {
  date: Date;
  assets: { [key: string]: number };
  liabilities: { [key: string]: number };
  equity: { [key: string]: number };
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

export interface IncomeStatement {
  period: string;
  revenue: { [key: string]: number };
  expenses: { [key: string]: number };
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
}

export interface CashFlowStatement {
  period: string;
  operatingActivities: { [key: string]: number };
  investingActivities: { [key: string]: number };
  financingActivities: { [key: string]: number };
  totalOperating: number;
  totalInvesting: number;
  totalFinancing: number;
  netCashFlow: number;
  beginningCash: number;
  endingCash: number;
}

export interface EquityStatement {
  period: string;
  ownersEquity: { [key: string]: number };
  commonStock: { beginning: number; changes: number; ending: number };
  retainedEarnings: { beginning: number; changes: number; ending: number };
  totalEquity: number;
}

interface BookkeepingStore {
  ledgers: GeneralLedgerView[];
  setLedgers: (ledgers: GeneralLedgerView[]) => void;
  deleteEntry: (id: string) => void;
  getGeneralLedger: () => GeneralLedgerViewData[];
  getBalanceSheet: () => BalanceSheet;
  getIncomeStatement: () => IncomeStatement;
  getCashFlowStatement: () => CashFlowStatement;
  getEquityStatement: () => EquityStatement;
}

type LedgerEntry = {
  date: Date;
  description: string;
  debit: number;
  credit: number;
};

type GeneralLedgerViewData = {
  entries: LedgerEntry[];
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  balance: number;
};

export const useBookkeepingStore = create<BookkeepingStore>((set, get) => ({
  ledgers: [],
  setLedgers: (ledgers: GeneralLedgerView[]) => set({ ledgers: [...ledgers] }),
  deleteEntry: (id) =>
    set((state) => ({ ledgers: state.ledgers.filter((e) => e.id !== id) })),
  getGeneralLedger: () => {
    const ledger: Record<string, GeneralLedgerViewData> = {};
    get().ledgers.forEach((item) => {
      const code = item.bookAccount.code;
      if (!ledger[code]) {
        ledger[code] = {
          accountCode: code,
          accountName: item.bookAccount.name,
          accountType: item.bookAccount.accountType,
          entries: [],
          balance: 0,
        };
      }
      ledger[code].entries.push({
        date: item.date,
        description: item.item ?? "",
        debit: item.debit ?? 0,
        credit: item.credit ?? 0,
      });
    });

    // Calculate balances
    Object.values(ledger).forEach((account) => {
      account.balance = account.entries.reduce(
        (sum, entry) => sum + entry.debit - entry.credit,
        0
      );
    });

    return Object.values(ledger);
  },
  getBalanceSheet: () => {
    const ledger = get().getGeneralLedger();
    const incomeStatement = get().getIncomeStatement();
    const balanceSheet: BalanceSheet = {
      date: new Date(),
      assets: {},
      liabilities: {},
      equity: {},
      totalAssets: 0,
      totalLiabilities: 0,
      totalEquity: 0,
    };

    ledger.forEach((account) => {
      if (account.accountType === AccountType.ASSET) {
        balanceSheet.assets[account.accountName] = account.balance;
        balanceSheet.totalAssets += account.balance;
      } else if (account.accountType === AccountType.LIABILITY) {
        const liabilityBalance = -account.balance;
        balanceSheet.liabilities[account.accountName] = liabilityBalance;
        balanceSheet.totalLiabilities += liabilityBalance;
      } else if (account.accountType === AccountType.EQUITY) {
        const equityBalance = -account.balance;
        balanceSheet.equity[account.accountName] = equityBalance;
        balanceSheet.totalEquity += equityBalance;
      }
    });

    balanceSheet.equity["Retained Earnings"] =
      (balanceSheet.equity["Retained Earnings"] || 0) +
      incomeStatement.netIncome;
    balanceSheet.totalEquity += incomeStatement.netIncome;

    return balanceSheet;
  },
  getIncomeStatement: () => {
    const ledger = get().getGeneralLedger();
    const incomeStatement: IncomeStatement = {
      period: `${new Date().getFullYear()}-01 to ${new Date().getFullYear()}-12`,
      revenue: {},
      expenses: {},
      totalRevenue: 0,
      totalExpenses: 0,
      netIncome: 0,
    };

    ledger.forEach((account) => {
      if (account.accountType === AccountType.REVENUE) {
        const revenueBalance = -account.balance;
        incomeStatement.revenue[account.accountName] = revenueBalance;
        incomeStatement.totalRevenue += revenueBalance;
      } else if (account.accountType === AccountType.EXPENSE) {
        incomeStatement.expenses[account.accountName] = account.balance;
        incomeStatement.totalExpenses += account.balance;
      }
    });

    incomeStatement.netIncome =
      incomeStatement.totalRevenue - incomeStatement.totalExpenses;
    return incomeStatement;
  },
  getCashFlowStatement: () => {
    const ledger = get().getGeneralLedger();
    const cashAccount = ledger.find((a) => a.accountCode === "1000");
    const cashFlowStatement: CashFlowStatement = {
      period: `${new Date().getFullYear()}-01 to ${new Date().getFullYear()}-12`,
      operatingActivities: {
        Sales: -(ledger.find((a) => a.accountCode === "411")?.balance || 0),
        "Other Income": -(
          ledger.find((a) => a.accountCode === "412")?.balance || 0
        ),
        "Salaries Expense": -(
          ledger.find((a) => a.accountCode === "601")?.balance || 0
        ),
        "Rent Expense": -(
          ledger.find((a) => a.accountCode === "603")?.balance || 0
        ),
        "Utilities Expense": -(
          ledger.find((a) => a.accountCode === "604")?.balance || 0
        ),
      },
      investingActivities: {
        "Sale/Disposal of Store Equipment": -(
          ledger.find((a) => a.accountCode === "121A")?.balance || 0
        ),
        "Sale/Disposal of Office Equipment": -(
          ledger.find((a) => a.accountCode === "122A")?.balance || 0
        ),
        "Sale/Disposal of Furniture & Fixtures Equipment": -(
          ledger.find((a) => a.accountCode === "126A")?.balance || 0
        ),
        "Purchase of Store Equipment": -(
          ledger.find((a) => a.accountCode === "121")?.balance || 0
        ),
        "Purchase of Office Equipment": -(
          ledger.find((a) => a.accountCode === "122")?.balance || 0
        ),
        "Purchase of Furniture & Fixtures": -(
          ledger.find((a) => a.accountCode === "126")?.balance || 0
        ),
      },
      financingActivities: {
        "Owner's Capital": -(
          ledger.find((a) => a.accountCode === "311")?.balance || 0
        ),
        "Note's Payable": -(
          ledger.find((a) => a.accountCode === "212")?.balance || 0
        ),
        "Owner's Drawings":
          ledger.find((a) => a.accountCode === "312")?.balance || 0,
        // "Stock Issued":
        //   ledger.find((a) => a.accountCode === "3000")?.balance || 0,
        // "Loan Obtained":
        //   ledger.find((a) => a.accountCode === "2500")?.balance || 0,
      },
      totalOperating: 0,
      totalInvesting: 0,
      totalFinancing: 0,
      netCashFlow: 0,
      beginningCash: 0,
      endingCash: cashAccount?.balance || 0,
    };

    cashFlowStatement.totalOperating = Object.values(
      cashFlowStatement.operatingActivities
    ).reduce((a, b) => a + b, 0);
    cashFlowStatement.totalInvesting = Object.values(
      cashFlowStatement.investingActivities
    ).reduce((a, b) => a + b, 0);
    cashFlowStatement.totalFinancing = Object.values(
      cashFlowStatement.financingActivities
    ).reduce((a, b) => a + b, 0);
    cashFlowStatement.netCashFlow =
      cashFlowStatement.totalOperating +
      cashFlowStatement.totalInvesting +
      cashFlowStatement.totalFinancing;

    return cashFlowStatement;
  },
  getEquityStatement: () => {
    const ledger = get().getGeneralLedger();
    const incomeStatement = get().getIncomeStatement();
    const commonStock = -(
      ledger.find((a) => a.accountCode === "3000")?.balance || 0
    );
    const retainedEarnings = -(
      ledger.find((a) => a.accountCode === "3100")?.balance || 0
    );

    const ownersEquity = {
      "Owner's Capital": -(
        ledger.find((a) => a.accountCode === "311")?.balance || 0
      ),
      "Note's Payable": -(
        ledger.find((a) => a.accountCode === "212")?.balance || 0
      ),
      "Owner's Drawings":
        ledger.find((a) => a.accountCode === "312")?.balance || 0,
    };

    return {
      period: `${new Date().getFullYear()}-01 to ${new Date().getFullYear()}-12`,
      ownersEquity: {
        ...ownersEquity,
        ending: Object.values(ownersEquity).reduce(
          (sum, balance) => (sum += balance),
          0
        ),
      },
      commonStock: {
        beginning: commonStock,
        changes: 0,
        ending: commonStock,
      },
      retainedEarnings: {
        beginning: retainedEarnings,
        changes: incomeStatement.netIncome,
        ending: retainedEarnings + incomeStatement.netIncome,
      },
      totalEquity: commonStock + retainedEarnings + incomeStatement.netIncome,
    };
  },
}));
