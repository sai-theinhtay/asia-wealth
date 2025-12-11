import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, change, changeLabel, icon: Icon }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50"
      data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight mb-2">{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-2">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? "+" : ""}{change}%
            </span>
            {changeLabel && (
              <span className="text-xs text-muted-foreground ml-1">{changeLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
