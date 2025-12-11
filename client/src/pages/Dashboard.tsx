import { useState } from "react";
import { DollarSign, Car, Wrench, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { RevenueChart } from "@/components/RevenueChart";
import { RecentActivities } from "@/components/RecentActivities";
import { QuickActions } from "@/components/QuickActions";
import { FinanceSummary } from "@/components/FinanceSummary";
import { VehicleFormDialog } from "@/components/VehicleFormDialog";
import { ServiceFormDialog } from "@/components/ServiceFormDialog";
import { MemberFormDialog } from "@/components/MemberFormDialog";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockChartData = [
  { name: "Jan", sales: 45000, service: 12000 },
  { name: "Feb", sales: 52000, service: 14000 },
  { name: "Mar", sales: 48000, service: 16000 },
  { name: "Apr", sales: 61000, service: 15000 },
  { name: "May", sales: 55000, service: 18000 },
  { name: "Jun", sales: 67000, service: 20000 },
];

// todo: remove mock functionality
const mockActivities = [
  { id: "1", type: "sale" as const, title: "Vehicle Sold", description: "2024 Toyota Camry - John Smith", time: "2h ago" },
  { id: "2", type: "service" as const, title: "Service Completed", description: "Oil change - Honda Accord", time: "3h ago" },
  { id: "3", type: "member" as const, title: "New Member", description: "Sarah Johnson registered", time: "5h ago" },
  { id: "4", type: "payment" as const, title: "Payment Received", description: "$2,500 - Service invoice", time: "6h ago" },
  { id: "5", type: "sale" as const, title: "Vehicle Reserved", description: "2023 Honda CR-V - Mike Wilson", time: "8h ago" },
];

export default function Dashboard() {
  const { toast } = useToast();
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Dashboard</h1>
        <p className="text-muted-foreground text-lg">Welcome back! Here's an overview of your shop.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$124,560"
          change={12.5}
          changeLabel="vs last month"
          icon={DollarSign}
        />
        <StatCard
          title="Vehicles Sold"
          value="18"
          change={8.2}
          changeLabel="vs last month"
          icon={Car}
        />
        <StatCard
          title="Active Services"
          value="12"
          change={-3.1}
          changeLabel="vs last week"
          icon={Wrench}
        />
        <StatCard
          title="Low Stock Alerts"
          value="3"
          icon={AlertTriangle}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueChart data={mockChartData} />
        <RecentActivities activities={mockActivities} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <QuickActions
          onNewSale={() => toast({ title: "Navigate to Sales", description: "Opening sales module..." })}
          onNewService={() => setServiceDialogOpen(true)}
          onNewMember={() => setMemberDialogOpen(true)}
          onAddVehicle={() => setVehicleDialogOpen(true)}
        />
        <FinanceSummary
          totalRevenue={124560}
          totalExpenses={45200}
          netProfit={79360}
          outstanding={12500}
          targetRevenue={150000}
        />
      </div>

      <VehicleFormDialog
        open={vehicleDialogOpen}
        onOpenChange={setVehicleDialogOpen}
        onSubmit={(data) => toast({ title: "Vehicle Added", description: `${data.year} ${data.make} ${data.model} added to inventory` })}
      />
      <ServiceFormDialog
        open={serviceDialogOpen}
        onOpenChange={setServiceDialogOpen}
        onSubmit={(data) => toast({ title: "Service Scheduled", description: `Appointment for ${data.customer} on ${data.date}` })}
      />
      <MemberFormDialog
        open={memberDialogOpen}
        onOpenChange={setMemberDialogOpen}
        onSubmit={(data) => toast({ title: "Member Added", description: `${data.name} has been registered` })}
      />
    </div>
  );
}
