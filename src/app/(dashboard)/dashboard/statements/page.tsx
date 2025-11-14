"use client";
import { findAllGeneralLedgersAction } from "@/actions/general-ledger";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { generateExcelFile } from "@/lib/excel-export";
import { useBookkeepingStore } from "@/store/bookkeeping-store";
import { Download } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function StatementsPage() {
  const { company } = useAuth();
  const {
    setLedgers,
    getBalanceSheet,
    getIncomeStatement,
    getCashFlowStatement,
    getEquityStatement,
  } = useBookkeepingStore();

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
  const balanceSheet = getBalanceSheet();
  const incomeStatement = getIncomeStatement();
  const cashFlow = getCashFlowStatement();
  const equityStatement = getEquityStatement();

  useEffect(() => {
    loadLedgers();
  }, []);

  const handleExport = () => {
    const timestamp = new Date().toISOString().split("T")[0];
    generateExcelFile(
      balanceSheet,
      incomeStatement,
      cashFlow,
      equityStatement,
      timestamp
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-secondary">
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            Financial Position & Performance
          </h2>
          <Button onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export to Excel
          </Button>
        </div>

        <Tabs defaultValue="balance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
            <TabsTrigger value="income">Income Statement</TabsTrigger>
            <TabsTrigger value="cash">Cash Flow</TabsTrigger>
            <TabsTrigger value="equity">Equity</TabsTrigger>
          </TabsList>

          {/* Balance Sheet Tab */}
          <TabsContent value="balance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Balance Sheet</CardTitle>
                <CardDescription>
                  As of {balanceSheet.date.toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Assets */}
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-4">
                    ASSETS
                  </h3>
                  <div className="space-y-2 bg-secondary rounded-lg p-4 mb-2">
                    {Object.entries(balanceSheet.assets).map(
                      ([name, value]) => (
                        <div key={name} className="flex justify-between">
                          <span className="text-foreground">{name}</span>
                          <span className="font-medium text-primary">
                            ${(value as number).toFixed(2)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex justify-between bg-primary/10 rounded-lg p-4 font-bold border-t-2 border-primary">
                    <span>Total Assets</span>
                    <span className="text-primary">
                      ${balanceSheet.totalAssets.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Liabilities */}
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-4">
                    LIABILITIES
                  </h3>
                  <div className="space-y-2 bg-secondary rounded-lg p-4 mb-2">
                    {Object.entries(balanceSheet.liabilities).map(
                      ([name, value]) => (
                        <div key={name} className="flex justify-between">
                          <span className="text-foreground">{name}</span>
                          <span className="font-medium text-accent">
                            ${(value as number).toFixed(2)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex justify-between bg-accent/10 rounded-lg p-4 font-bold border-t-2 border-accent">
                    <span>Total Liabilities</span>
                    <span className="text-accent">
                      ${balanceSheet.totalLiabilities.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Equity */}
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-4">
                    SHAREHOLDERS' EQUITY
                  </h3>
                  <div className="space-y-2 bg-secondary rounded-lg p-4 mb-2">
                    {Object.entries(balanceSheet.equity).map(
                      ([name, value]) => (
                        <div key={name} className="flex justify-between">
                          <span className="text-foreground">{name}</span>
                          <span className="font-medium text-green-600">
                            ${(value as number).toFixed(2)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex justify-between bg-green-50 dark:bg-green-950 rounded-lg p-4 font-bold border-t-2 border-green-600">
                    <span>Total Equity</span>
                    <span className="text-green-600">
                      ${balanceSheet.totalEquity.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Verification */}
                <div className="border-t-2 border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-medium">
                      Assets = Liabilities + Equity
                    </span>
                    <span
                      className={`font-bold text-lg ${
                        Math.abs(
                          balanceSheet.totalAssets -
                            (balanceSheet.totalLiabilities +
                              balanceSheet.totalEquity)
                        ) < 0.01
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {Math.abs(
                        balanceSheet.totalAssets -
                          (balanceSheet.totalLiabilities +
                            balanceSheet.totalEquity)
                      ) < 0.01
                        ? "✓ Balanced"
                        : "✗ Not Balanced"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Income Statement Tab */}
          <TabsContent value="income" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Income Statement</CardTitle>
                <CardDescription>
                  Period: {incomeStatement.period}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Revenue */}
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-4">
                    REVENUE
                  </h3>
                  <div className="space-y-2 bg-secondary rounded-lg p-4 mb-2">
                    {Object.entries(incomeStatement.revenue).map(
                      ([name, value]) => (
                        <div key={name} className="flex justify-between">
                          <span className="text-foreground">{name}</span>
                          <span className="font-medium text-green-600">
                            ${(value as number).toFixed(2)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex justify-between bg-green-50 dark:bg-green-950 rounded-lg p-4 font-bold border-t-2 border-green-600">
                    <span>Total Revenue</span>
                    <span className="text-green-600">
                      ${incomeStatement.totalRevenue.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Expenses */}
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-4">
                    EXPENSES
                  </h3>
                  <div className="space-y-2 bg-secondary rounded-lg p-4 mb-2">
                    {Object.entries(incomeStatement.expenses).map(
                      ([name, value]) => (
                        <div key={name} className="flex justify-between">
                          <span className="text-foreground">{name}</span>
                          <span className="font-medium text-red-600">
                            ${(value as number).toFixed(2)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex justify-between bg-red-50 dark:bg-red-950 rounded-lg p-4 font-bold border-t-2 border-red-600">
                    <span>Total Expenses</span>
                    <span className="text-red-600">
                      ${incomeStatement.totalExpenses.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Net Income */}
                <div className="border-t-2 border-border pt-4">
                  <div className="flex justify-between items-center bg-primary/10 rounded-lg p-4 font-bold text-lg">
                    <span>Net Income</span>
                    <span
                      className={
                        incomeStatement.netIncome >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      ${incomeStatement.netIncome.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cash Flow Tab */}
          <TabsContent value="cash" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statement of Cash Flows</CardTitle>
                <CardDescription>Period: {cashFlow.period}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Operating Activities */}
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-4">
                    OPERATING ACTIVITIES
                  </h3>
                  <div className="space-y-2 bg-secondary rounded-lg p-4 mb-2">
                    {Object.entries(cashFlow.operatingActivities).map(
                      ([name, value]) => (
                        <div key={name} className="flex justify-between">
                          <span className="text-foreground">{name}</span>
                          <span
                            className={`font-medium ${
                              (value as number) >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            ${(value as number).toFixed(2)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex justify-between bg-primary/10 rounded-lg p-4 font-bold border-t-2 border-primary">
                    <span>Net Operating Cash Flow</span>
                    <span className="text-primary">
                      ${cashFlow.totalOperating.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Investing Activities */}
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-4">
                    INVESTING ACTIVITIES
                  </h3>
                  <div className="space-y-2 bg-secondary rounded-lg p-4 mb-2">
                    {Object.entries(cashFlow.investingActivities).map(
                      ([name, value]) => (
                        <div key={name} className="flex justify-between">
                          <span className="text-foreground">{name}</span>
                          <span
                            className={`font-medium ${
                              (value as number) >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            ${(value as number).toFixed(2)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex justify-between bg-primary/10 rounded-lg p-4 font-bold border-t-2 border-primary">
                    <span>Net Investing Cash Flow</span>
                    <span className="text-primary">
                      ${cashFlow.totalInvesting.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Financing Activities */}
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-4">
                    FINANCING ACTIVITIES
                  </h3>
                  <div className="space-y-2 bg-secondary rounded-lg p-4 mb-2">
                    {Object.entries(cashFlow.financingActivities).map(
                      ([name, value]) => (
                        <div key={name} className="flex justify-between">
                          <span className="text-foreground">{name}</span>
                          <span
                            className={`font-medium ${
                              (value as number) >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            ${(value as number).toFixed(2)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex justify-between bg-primary/10 rounded-lg p-4 font-bold border-t-2 border-primary">
                    <span>Net Financing Cash Flow</span>
                    <span className="text-primary">
                      ${cashFlow.totalFinancing.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Cash Summary */}
                <div className="border-t-2 border-border pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-foreground">Beginning Cash</span>
                    <span className="font-medium">
                      ${cashFlow.beginningCash.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between bg-primary/10 rounded-lg p-3 font-bold text-lg">
                    <span>Net Change in Cash</span>
                    <span className="text-primary">
                      ${cashFlow.netCashFlow.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between bg-accent/10 rounded-lg p-3 font-bold text-lg border-t-2 border-accent">
                    <span>Ending Cash</span>
                    <span className="text-accent">
                      ${cashFlow.endingCash.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equity Statement Tab */}
          <TabsContent value="equity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statement of Shareholders' Equity</CardTitle>
                <CardDescription>
                  Period: {equityStatement.period}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Owner's Equity */}
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-4">
                    OWNER"S EQUITY
                  </h3>
                  <div className="space-y-2 bg-secondary rounded-lg p-4">
                    {Object.entries(equityStatement.ownersEquity).slice(0, -1).map(
                      ([name, value]) => (
                        <div key={name} className="flex justify-between">
                          <span className="text-foreground">{name}</span>
                          <span className="font-medium">
                            ${value.toFixed(2)}
                          </span>
                        </div>
                      )
                    )}
                    <div className="flex justify-between bg-primary/10 rounded-lg p-3 font-bold border-t-2 border-primary">
                      <span>Ending Balance</span>
                      <span className="text-primary">
                        ${equityStatement.commonStock.ending.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Common Stock */}
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-4">
                    COMMON STOCK
                  </h3>
                  <div className="space-y-2 bg-secondary rounded-lg p-4">
                    <div className="flex justify-between">
                      <span className="text-foreground">Beginning Balance</span>
                      <span className="font-medium">
                        ${equityStatement.commonStock.beginning.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="text-foreground">Add: Changes</span>
                      <span className="font-medium">
                        ${equityStatement.commonStock.changes.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between bg-primary/10 rounded-lg p-3 font-bold border-t-2 border-primary">
                      <span>Ending Balance</span>
                      <span className="text-primary">
                        ${equityStatement.commonStock.ending.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Retained Earnings */}
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-4">
                    RETAINED EARNINGS
                  </h3>
                  <div className="space-y-2 bg-secondary rounded-lg p-4">
                    <div className="flex justify-between">
                      <span className="text-foreground">Beginning Balance</span>
                      <span className="font-medium">
                        ${equityStatement.retainedEarnings.beginning.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="text-foreground">Add: Net Income</span>
                      <span
                        className={`font-medium ${
                          equityStatement.retainedEarnings.changes >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ${equityStatement.retainedEarnings.changes.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between bg-primary/10 rounded-lg p-3 font-bold border-t-2 border-primary">
                      <span>Ending Balance</span>
                      <span className="text-primary">
                        ${equityStatement.retainedEarnings.ending.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Equity */}
                <div className="border-t-2 border-border pt-4">
                  <div className="flex justify-between items-center bg-green-50 dark:bg-green-950 rounded-lg p-4 font-bold text-lg">
                    <span>Total Shareholders' Equity</span>
                    <span className="text-green-600">
                      ${equityStatement.totalEquity.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
