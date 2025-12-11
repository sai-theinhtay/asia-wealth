import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FinanceSummaryProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  outstanding: number;
  targetRevenue: number;
}

export function FinanceSummary({
  totalRevenue,
  totalExpenses,
  netProfit,
  outstanding,
  targetRevenue,
}: FinanceSummaryProps) {
  const progressPercent = Math.min((totalRevenue / targetRevenue) * 100, 100);

  return (
    <Card data-testid="finance-summary">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Financial Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Monthly Target</span>
            <span className="text-sm font-medium">{progressPercent.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">
              ${totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">
              ${targetRevenue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Revenue</span>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Expenses</span>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              ${totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Net Profit</span>
            <p className={`text-lg font-semibold ${netProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              ${netProfit.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Outstanding</span>
            <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
              ${outstanding.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
