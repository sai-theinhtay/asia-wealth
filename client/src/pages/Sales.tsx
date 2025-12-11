import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleCard } from "@/components/VehicleCard";
import { VehicleFormDialog } from "@/components/VehicleFormDialog";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockVehicles = [
  { id: "1", make: "Toyota", model: "Camry", year: 2024, price: 28500, mileage: 12500, status: "available" as const },
  { id: "2", make: "Honda", model: "CR-V", year: 2023, price: 32000, mileage: 18000, status: "reserved" as const },
  { id: "3", make: "Ford", model: "F-150", year: 2024, price: 45000, mileage: 8000, status: "available" as const },
  { id: "4", make: "Chevrolet", model: "Silverado", year: 2023, price: 42000, mileage: 22000, status: "sold" as const },
  { id: "5", make: "BMW", model: "X5", year: 2024, price: 65000, mileage: 5000, status: "available" as const },
  { id: "6", make: "Mercedes", model: "C-Class", year: 2023, price: 48000, mileage: 15000, status: "available" as const },
];

export default function Sales() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredVehicles = mockVehicles.filter((v) => {
    const matchesSearch = `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Sales</h1>
          <p className="text-muted-foreground">Manage your vehicle inventory and sales</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-add-vehicle">
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]" data-testid="select-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredVehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onView={(id) => toast({ title: "View Vehicle", description: `Viewing vehicle #${id}` })}
            onEdit={(id) => toast({ title: "Edit Vehicle", description: `Editing vehicle #${id}` })}
          />
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No vehicles found matching your criteria.</p>
        </div>
      )}

      <VehicleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => toast({ title: "Vehicle Added", description: `${data.year} ${data.make} ${data.model} added to inventory` })}
      />
    </div>
  );
}
