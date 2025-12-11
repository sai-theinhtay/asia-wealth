import { useState } from "react";
import { Plus, Search, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BranchCard } from "@/components/BranchCard";
import { BranchFormDialog } from "@/components/BranchFormDialog";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockBranches = [
  { id: "1", name: "AutoPro Main", address: "123 Auto Drive, Motor City", phone: "(555) 000-1234", manager: "John Doe", employeeCount: 12, vehicleCount: 45, status: "active" as const },
  { id: "2", name: "AutoPro Downtown", address: "456 Main Street, Motor City", phone: "(555) 111-2345", manager: "Jane Smith", employeeCount: 8, vehicleCount: 28, status: "active" as const },
  { id: "3", name: "AutoPro Westside", address: "789 West Ave, Motor City", phone: "(555) 222-3456", manager: "Mike Wilson", employeeCount: 6, vehicleCount: 18, status: "active" as const },
  { id: "4", name: "AutoPro Eastgate", address: "321 East Blvd, Motor City", phone: "(555) 333-4567", manager: "Sarah Johnson", employeeCount: 4, vehicleCount: 12, status: "inactive" as const },
];

export default function Branches() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBranches = mockBranches.filter((branch) =>
    `${branch.name} ${branch.address} ${branch.manager}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalBranches: mockBranches.length,
    activeBranches: mockBranches.filter((b) => b.status === "active").length,
    totalEmployees: mockBranches.reduce((sum, b) => sum + b.employeeCount, 0),
    totalVehicles: mockBranches.reduce((sum, b) => sum + b.vehicleCount, 0),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Branches</h1>
          <p className="text-muted-foreground">Manage your shop network and sub-branches</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-add-branch">
          <Plus className="h-4 w-4 mr-2" />
          Create Branch
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Total Branches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.totalBranches}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Branches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">{stats.activeBranches}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.totalEmployees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.totalVehicles}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search branches by name, location, or manager..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBranches.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            onViewDetails={(id) => toast({ title: "View Branch", description: `Opening branch #${id} details` })}
            onManage={(id) => toast({ title: "Manage Branch", description: `Opening management panel for branch #${id}` })}
          />
        ))}
      </div>

      {filteredBranches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No branches found matching your search.</p>
        </div>
      )}

      <BranchFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => toast({ title: "Branch Created", description: `${data.name} has been created successfully` })}
      />
    </div>
  );
}
