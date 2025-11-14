"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBookkeepingStore } from "@/store/bookkeeping-store";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AccountType } from "@prisma/client";
import { GeneralLedgerView } from "@/interfaces/general-ledger.dto";

export interface LedgerPageProps {
  data: GeneralLedgerView[];
}

export default function LedgerPage({ data }: LedgerPageProps) {
  const { setLedgers, getGeneralLedger } = useBookkeepingStore();
  const ledger = getGeneralLedger();
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("assets");

  console.log({ ledgerCount: ledger.length });

  useEffect(() => {
    setLedgers(data);
    console.log({ data })
  }, [data]);

  const getAccountTypeColor = (accountType: AccountType) => {
    // if (accountType == AccountType.EXPENSE) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
    switch (accountType) {
      case AccountType.ASSET:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case AccountType.LIABILITY:
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case AccountType.EQUITY:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case AccountType.REVENUE:
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case AccountType.EXPENSE:
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    }
  };

  const getTypeLabel = (accountType: AccountType) => {
    switch (accountType) {
      case AccountType.ASSET:
        return "Asset";
      case AccountType.LIABILITY:
        return "Liability";
      case AccountType.EQUITY:
        return "Equity";
      case AccountType.REVENUE:
        return "Revenue";
      case AccountType.EXPENSE:
        return "Expenses";
      default:
        return "Other";
    }
  };

  const getFilteredLedger = () => {
    const typeMap: Record<string, (accountType: AccountType) => boolean> = {
      assets: (type) => type == AccountType.ASSET,
      liabilities: (type) => type == AccountType.LIABILITY,
      equity: (type) => type == AccountType.EQUITY,
      revenue: (type) => type == AccountType.REVENUE,
      // purchases: (type) => type == AccountType.EXPENSE,
      expenses: (type) => type == AccountType.EXPENSE,
    };
    return ledger.filter(
      (account) => typeMap[activeTab]?.(account.accountType) ?? false
    );
  };

  const tabs = [
    { id: "assets", label: "Assets", color: "bg-blue-100 text-blue-800" },
    {
      id: "liabilities",
      label: "Liabilities",
      color: "bg-red-100 text-red-800",
    },
    { id: "equity", label: "Equity", color: "bg-purple-100 text-purple-800" },
    { id: "revenue", label: "Revenue", color: "bg-green-100 text-green-800" },
    // {
    //   id: "purchases",
    //   label: "Purchases",
    //   color: "bg-emerald-100 text-emerald-800",
    // },
    {
      id: "expenses",
      label: "Expenses",
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const filteredLedger = getFilteredLedger();

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-secondary">
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            General Ledger
          </h2>
          <p className="text-muted-foreground">
            Detailed transaction history by account type
          </p>
        </div>

        <div className="mb-8 border-b border-border">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setExpandedAccount(null);
                }}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredLedger.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No transactions recorded for this account type
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredLedger.map((account) => (
              <Card key={account.accountCode} className="overflow-hidden">
                <div
                  className="bg-secondary px-6 py-4 cursor-pointer hover:bg-secondary/80 transition-colors flex items-start justify-between"
                  onClick={() =>
                    setExpandedAccount(
                      expandedAccount === account.accountCode
                        ? null
                        : account.accountCode
                    )
                  }
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold text-foreground">
                          {account.accountName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Code: {account.accountCode}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={getAccountTypeColor(account.accountType)}
                      >
                        {getTypeLabel(account.accountType)}
                      </Badge>
                      <div className="text-right min-w-max">
                        <div className="font-bold text-lg text-foreground">
                          ${account.balance.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Balance
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedAccount === account.accountCode && (
                  <CardContent className="pt-4 border-t border-border">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b border-border">
                          <tr className="text-muted-foreground">
                            <th className="text-left py-2 px-3 font-medium">
                              Date
                            </th>
                            <th className="text-left py-2 px-3 font-medium">
                              Description
                            </th>
                            <th className="text-right py-2 px-3 font-medium">
                              Debit
                            </th>
                            <th className="text-right py-2 px-3 font-medium">
                              Credit
                            </th>
                            <th className="text-right py-2 px-3 font-medium">
                              Balance
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {account.entries.map((entry, idx) => {
                            const runningBalance = account.entries
                              .slice(0, idx + 1)
                              .reduce((sum, e) => sum + e.debit - e.credit, 0);
                            return (
                              <tr
                                key={idx}
                                className="border-b border-border hover:bg-secondary transition-colors"
                              >
                                <td className="py-2 px-3 text-foreground font-medium">
                                  {entry.date.toLocaleDateString()}
                                </td>
                                <td className="py-2 px-3 text-foreground">
                                  {entry.description}
                                </td>
                                <td className="py-2 px-3 text-right font-mono text-primary">
                                  {entry.debit > 0
                                    ? `$${entry.debit.toFixed(2)}`
                                    : "-"}
                                </td>
                                <td className="py-2 px-3 text-right font-mono text-accent">
                                  {entry.credit > 0
                                    ? `$${entry.credit.toFixed(2)}`
                                    : "-"}
                                </td>
                                <td className="py-2 px-3 text-right font-mono font-bold text-foreground">
                                  ${runningBalance.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
