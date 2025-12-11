import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, History } from "lucide-react";

interface WalletCardProps {
  balance: number;
  currency?: string;
  onTopUp?: () => void;
  onViewHistory?: () => void;
}

export function WalletCard({ balance, currency = "$", onTopUp, onViewHistory }: WalletCardProps) {
  return (
    <Card data-testid="wallet-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Wallet className="h-5 w-5 text-green-500" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-3xl font-bold">{currency}{balance.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Available for payments</p>
        </div>

        <div className="flex items-center gap-2">
          <Button className="flex-1" onClick={onTopUp} data-testid="button-top-up">
            <Plus className="h-4 w-4 mr-2" />
            Top Up
          </Button>
          <Button variant="outline" onClick={onViewHistory} data-testid="button-wallet-history">
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface WalletTransactionProps {
  transactions: Array<{
    id: string;
    type: "credit" | "debit";
    amount: number;
    description: string;
    date: string;
  }>;
}

export function WalletTransactions({ transactions }: WalletTransactionProps) {
  return (
    <Card data-testid="wallet-transactions">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                tx.type === "credit" 
                  ? "bg-green-100 dark:bg-green-900/30" 
                  : "bg-red-100 dark:bg-red-900/30"
              }`}>
                {tx.type === "credit" ? (
                  <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{tx.date}</p>
              </div>
            </div>
            <span className={`font-semibold ${
              tx.type === "credit" 
                ? "text-green-600 dark:text-green-400" 
                : "text-red-600 dark:text-red-400"
            }`}>
              {tx.type === "credit" ? "+" : "-"}${tx.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
