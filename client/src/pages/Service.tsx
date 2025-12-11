import { useState } from "react";
import { Plus, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceTable } from "@/components/ServiceTable";
import { ServiceFormDialog } from "@/components/ServiceFormDialog";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockAppointments = [
  { id: "1", vehicle: "2023 Honda Accord", customer: "John Smith", service: "Oil Change", date: "Dec 8, 2025", status: "completed" as const, amount: 85 },
  { id: "2", vehicle: "2022 Toyota RAV4", customer: "Jane Doe", service: "Brake Service", date: "Dec 9, 2025", status: "in-progress" as const, amount: 450 },
  { id: "3", vehicle: "2024 Ford F-150", customer: "Mike Wilson", service: "Full Inspection", date: "Dec 10, 2025", status: "pending" as const, amount: 150 },
  { id: "4", vehicle: "2023 Chevrolet Equinox", customer: "Sarah Johnson", service: "Tire Rotation", date: "Dec 11, 2025", status: "pending" as const, amount: 65 },
  { id: "5", vehicle: "2021 BMW 3 Series", customer: "David Chen", service: "Engine Repair", date: "Dec 12, 2025", status: "pending" as const, amount: 1200 },
];

export default function Service() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesSearch = `${apt.vehicle} ${apt.customer} ${apt.service}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || apt.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    all: mockAppointments.length,
    pending: mockAppointments.filter((a) => a.status === "pending").length,
    "in-progress": mockAppointments.filter((a) => a.status === "in-progress").length,
    completed: mockAppointments.filter((a) => a.status === "completed").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Service</h1>
          <p className="text-muted-foreground">Manage service appointments and job cards</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" data-testid="button-calendar-view">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button onClick={() => setDialogOpen(true)} data-testid="button-schedule-service">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Service
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">
            All ({stats.all})
          </TabsTrigger>
          <TabsTrigger value="pending" data-testid="tab-pending">
            Pending ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="in-progress" data-testid="tab-in-progress">
            In Progress ({stats["in-progress"]})
          </TabsTrigger>
          <TabsTrigger value="completed" data-testid="tab-completed">
            Completed ({stats.completed})
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          <ServiceTable
            appointments={filteredAppointments}
            onView={(id) => toast({ title: "View Service", description: `Viewing service #${id}` })}
            onEdit={(id) => toast({ title: "Edit Service", description: `Editing service #${id}` })}
          />
        </TabsContent>
      </Tabs>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No appointments found.</p>
        </div>
      )}

      <ServiceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => toast({ title: "Service Scheduled", description: `Appointment for ${data.customer} on ${data.date}` })}
      />
    </div>
  );
}
