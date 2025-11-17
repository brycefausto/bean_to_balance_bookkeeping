"use client";
import { findAllGeneralLedgersAction } from "@/actions/general-ledger";
import { findAllJournalEntriesAction } from "@/actions/journal-entry";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice } from "@/lib/string.utils";
import { useBookkeepingStore } from "@/store/bookkeeping-store";
import { AccountType } from "@prisma/client";
import { BarChart3, BadgeX as Ledger, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { company } = useAuth();
  const { entries, setEntries, setLedgers, getGeneralLedger } =
    useBookkeepingStore();
  const ledger = getGeneralLedger();

  const totalDebits = entries.reduce(
    (sum, entry) =>
      sum + entry.entries.reduce((s, line) => s + (line.debit ?? 0), 0),
    0
  );
  const assetAccounts = ledger.filter(
    (acc) => acc.accountType == AccountType.ASSET
  );
  const totalAssets = assetAccounts.reduce((sum, acc) => sum + acc.balance, 0);

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

  const loadJournalEntries = async () => {
    try {
      const result = await findAllJournalEntriesAction(company.id);
      if (result.data) {
        setEntries(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadLedgers();
    loadJournalEntries();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              Bookkeeping System
            </h1>
          </div>
          <nav className="flex gap-2">
            <Link href="/journal">
              <Button variant="outline" size="sm">
                Journal Entries
              </Button>
            </Link>
            <Link href="/ledger">
              <Button variant="outline" size="sm">
                General Ledger
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="outline" size="sm">
                Reports
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {entries.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Journal entries recorded
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Debits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {formatPrice(totalDebits)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Cumulative debits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {formatPrice(totalAssets)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Asset account balances
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Accounts Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {ledger.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active accounts
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ledger className="w-5 h-5 text-primary" />
                Recent Entries
              </CardTitle>
              <CardDescription>Latest journal entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entries
                  .slice(-5)
                  .reverse()
                  .map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start justify-between p-3 bg-secondary rounded-lg border border-border"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {entry.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {entry.date.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">
                          {entry.entries.length} lines
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              <Link href="/dashboard/journal-entries" className="mt-4 block">
                <Button className="w-full">View All Entries</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/journal-entries/create">
                <Button className="w-full" variant="default">
                  New Entry
                </Button>
              </Link>
              <Link href="/dashboard/ledger">
                <Button className="w-full bg-transparent" variant="outline">
                  View Ledger
                </Button>
              </Link>
              <Link href="/dashboard/reports">
                <Button className="w-full bg-transparent" variant="outline">
                  Generate Report
                </Button>
              </Link>
              <Link href="/dashboard/statements">
                <Button className="w-full bg-transparent" variant="outline">
                  Financial Statements
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
