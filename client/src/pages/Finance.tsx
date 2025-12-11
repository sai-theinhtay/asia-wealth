import { useState } from "react";
import { Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { TransactionTable } from "@/components/TransactionTable";
import { FinanceSummary } from "@/components/FinanceSummary";
import { RevenueChart } from "@/components/RevenueChart";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockTransactions = [
  { id: "1", type: "sale" as const, description: "2024 Toyota Camry - John Smith", date: "Dec 8, 2025", amount: 28500, status: "paid" as const },
  { id: "2", type: "service" as const, description: "Brake service - Honda Accord", date: "Dec 7, 2025", amount: 450, status: "paid" as const },
  { id: "3", type: "expense" as const, description: "Parts inventory - Oil filters", date: "Dec 6, 2025", amount: 1200, status: "paid" as const },
  { id: "4", type: "service" as const, description: "Engine repair - Ford F-150", date: "Dec 5, 2025", amount: 2500, status: "pending" as const },
  { id: "5", type: "sale" as const, description: "2023 Honda CR-V - Mike Wilson", date: "Dec 4, 2025", amount: 32000, status: "paid" as const },
  { id: "6", type: "expense" as const, description: "Equipment maintenance", date: "Dec 3, 2025", amount: 850, status: "paid" as const },
  { id: "7", type: "service" as const, description: "Full inspection - BMW X5", date: "Dec 2, 2025", amount: 150, status: "overdue" as const },
];

// todo: remove mock functionality
const mockChartData = [
  { name: "Jan", sales: 85000, service: 22000 },
  { name: "Feb", sales: 92000, service: 24000 },
  { name: "Mar", sales: 88000, service: 26000 },
  { name: "Apr", sales: 101000, service: 25000 },
  { name: "May", sales: 95000, service: 28000 },
  { name: "Jun", sales: 124560, service: 30000 },
];

export default function Finance() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredTransactions = mockTransactions.filter((tx) => {
    if (activeTab === "all") return true;
    return tx.type === activeTab;
  });

  const stats = {
    totalRevenue: 124560,
    salesRevenue: 95000,
    serviceRevenue: 29560,
    totalExpenses: 45200,
    outstanding: 12500,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Finance</h1>
          <p className="text-muted-foreground">Track revenue, expenses, and financial reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast({ title: "Export", description: "Generating PDF report..." })} data-testid="button-export-pdf">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => toast({ title: "Export", description: "Generating Excel report..." })} data-testid="button-export-excel">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
              ${stats.totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sales Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${stats.salesRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Service Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${stats.serviceRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
              ${stats.totalExpenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
              ${stats.outstanding.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueChart data={mockChartData} />
        <FinanceSummary
          totalRevenue={124560}
          totalExpenses={45200}
          netProfit={79360}
          outstanding={12500}
          targetRevenue={150000}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle className="text-lg">Transaction History</CardTitle>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-[140px]"
                data-testid="input-date-from"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-[140px]"
                data-testid="input-date-to"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
              <TabsTrigger value="sale" data-testid="tab-sales">Sales</TabsTrigger>
              <TabsTrigger value="service" data-testid="tab-service">Service</TabsTrigger>
              <TabsTrigger value="expense" data-testid="tab-expenses">Expenses</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-4">
              <TransactionTable transactions={filteredTransactions} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
