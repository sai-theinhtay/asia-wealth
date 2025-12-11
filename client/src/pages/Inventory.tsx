import { useState } from "react";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VehicleFormDialog } from "@/components/VehicleFormDialog";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockInventory = [
  { id: "1", make: "Toyota", model: "Camry", year: 2024, vin: "1HGBH41JXMN109186", price: 28500, status: "available", daysInStock: 15 },
  { id: "2", make: "Honda", model: "CR-V", year: 2023, vin: "2HGFG12649H550022", price: 32000, status: "reserved", daysInStock: 8 },
  { id: "3", make: "Ford", model: "F-150", year: 2024, vin: "1FTFW1EF1JFA00001", price: 45000, status: "available", daysInStock: 22 },
  { id: "4", make: "BMW", model: "X5", year: 2024, vin: "5UXCR6C56K0C19001", price: 65000, status: "available", daysInStock: 5 },
  { id: "5", make: "Mercedes", model: "C-Class", year: 2023, vin: "WDDWF4JB9HF000001", price: 48000, status: "available", daysInStock: 30 },
];

// todo: remove mock functionality
const mockLowStock = [
  { category: "SUVs", count: 2, threshold: 5 },
  { category: "Trucks", count: 1, threshold: 3 },
  { category: "Luxury", count: 3, threshold: 4 },
];

export default function Inventory() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInventory = mockInventory.filter((v) =>
    `${v.make} ${v.model} ${v.year} ${v.vin}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mockInventory.length,
    available: mockInventory.filter((v) => v.status === "available").length,
    reserved: mockInventory.filter((v) => v.status === "reserved").length,
    totalValue: mockInventory.reduce((sum, v) => sum + v.price, 0),
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Inventory</h1>
          <p className="text-muted-foreground">Track and manage your vehicle stock</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-add-vehicle">
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">{stats.available}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reserved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">{stats.reserved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${stats.totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by make, model, year, or VIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>VIN</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Days in Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((vehicle) => (
                  <TableRow key={vehicle.id} data-testid={`inventory-row-${vehicle.id}`}>
                    <TableCell className="font-medium">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{vehicle.vin}</TableCell>
                    <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={`border-0 ${
                          vehicle.status === "available"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {vehicle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={vehicle.daysInStock > 25 ? "text-red-600 dark:text-red-400" : ""}>
                        {vehicle.daysInStock} days
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockLowStock.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between p-2 rounded-md bg-muted"
              >
                <span className="text-sm font-medium">{item.category}</span>
                <Badge variant="outline" className="text-xs">
                  {item.count}/{item.threshold}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <VehicleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => toast({ title: "Vehicle Added", description: `${data.year} ${data.make} ${data.model} added to inventory` })}
      />
    </div>
  );
}
