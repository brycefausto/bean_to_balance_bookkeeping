"use client";

import { findAllGeneralLedgersAction } from "@/actions/general-ledger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useBookkeepingStore } from "@/store/bookkeeping-store";
import { BarChart3, Download } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { toast } from "sonner";

export default function ReportsPage() {
  const { company } = useAuth();
  const { setLedgers, getGeneralLedger } = useBookkeepingStore();
  const ledger = getGeneralLedger();

  const loadLedgers = async () => {
    try {
      const result = await findAllGeneralLedgersAction(company.id);
      if (result.data) {
        setLedgers(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadLedgers();
  }, []);

  // Calculate trial balance
  const trialBalance = ledger.map((account) => ({
    code: account.accountCode,
    name: account.accountName,
    debit: Math.max(0, account.balance),
    credit: Math.max(0, -account.balance),
  }));

  const totalDebits = trialBalance.reduce((sum, acc) => sum + acc.debit, 0);
  const totalCredits = trialBalance.reduce((sum, acc) => sum + acc.credit, 0);

  // Group by account type for pie chart
  const accountsByType = {
    Assets: ledger
      .filter((acc) => acc.accountCode < "2000")
      .reduce((sum, acc) => sum + Math.max(0, acc.balance), 0),
    Liabilities: ledger
      .filter((acc) => acc.accountCode >= "2000" && acc.accountCode < "3000")
      .reduce((sum, acc) => sum + Math.max(0, acc.balance), 0),
    Equity: ledger
      .filter((acc) => acc.accountCode >= "3000" && acc.accountCode < "4000")
      .reduce((sum, acc) => sum + Math.max(0, acc.balance), 0),
    Revenue: ledger
      .filter((acc) => acc.accountCode >= "4000" && acc.accountCode < "5000")
      .reduce((sum, acc) => sum + Math.max(0, acc.balance), 0),
    Expenses: ledger
      .filter((acc) => acc.accountCode >= "5000")
      .reduce((sum, acc) => sum + Math.max(0, acc.balance), 0),
  };

  const chartData = Object.entries(accountsByType)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  const COLORS = ["#004D7A", "#008C9E", "#00D4FF", "#90EE90", "#FFB347"];

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-secondary">
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Financial Reports
            </h2>
            <p className="text-muted-foreground">
              Trial balance and account analysis
            </p>
          </div>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Account Distribution</CardTitle>
              <CardDescription>Balance by account type</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) =>
                        `${name}: $${value.toFixed(0)}`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span className="text-muted-foreground">Total Accounts</span>
                  <span className="font-bold text-lg text-foreground">
                    {ledger.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span className="text-muted-foreground">Total Debits</span>
                  <span className="font-bold text-lg text-primary">
                    ${totalDebits.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                  <span className="text-muted-foreground">Total Credits</span>
                  <span className="font-bold text-lg text-accent">
                    ${totalCredits.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary rounded-lg border-2 border-primary">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    className={
                      Math.abs(totalDebits - totalCredits) < 0.01
                        ? "bg-accent text-accent-foreground"
                        : "bg-destructive text-destructive-foreground"
                    }
                  >
                    {Math.abs(totalDebits - totalCredits) < 0.01
                      ? "Balanced"
                      : "Not Balanced"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Trial Balance</span>
              <Badge variant="outline">
                As of {new Date().toLocaleDateString()}
              </Badge>
            </CardTitle>
            <CardDescription>
              All accounts with their current balances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr className="text-muted-foreground">
                    <th className="text-left py-3 px-3 font-medium">
                      Account Code
                    </th>
                    <th className="text-left py-3 px-3 font-medium">
                      Account Name
                    </th>
                    <th className="text-right py-3 px-3 font-medium">Debit</th>
                    <th className="text-right py-3 px-3 font-medium">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {trialBalance.map((account) => (
                    <tr
                      key={account.code}
                      className="border-b border-border hover:bg-secondary transition-colors"
                    >
                      <td className="py-3 px-3 font-mono font-bold text-primary">
                        {account.code}
                      </td>
                      <td className="py-3 px-3 text-foreground">
                        {account.name}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        {account.debit > 0
                          ? `$${account.debit.toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        {account.credit > 0
                          ? `$${account.credit.toFixed(2)}`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-secondary font-bold border-t-2 border-border">
                    <td colSpan={2} className="py-3 px-3">
                      Totals
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-primary">
                      ${totalDebits.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-accent">
                      ${totalCredits.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
