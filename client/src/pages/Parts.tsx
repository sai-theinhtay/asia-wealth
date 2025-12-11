import { useState } from "react";
import { Plus, Search, Filter, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PartCard } from "@/components/PartCard";
import { PartFormDialog } from "@/components/PartFormDialog";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const mockParts = [
  { id: "1", name: "Oil Filter", category: "Filters", sku: "OF-001", price: 24.99, stock: 45, minStock: 10 },
  { id: "2", name: "Brake Pads (Front)", category: "Brakes", sku: "BP-101", price: 89.99, stock: 22, minStock: 8 },
  { id: "3", name: "Air Filter", category: "Filters", sku: "AF-002", price: 19.99, stock: 38, minStock: 10 },
  { id: "4", name: "Spark Plugs (Set of 4)", category: "Engine Parts", sku: "SP-201", price: 45.00, stock: 15, minStock: 5 },
  { id: "5", name: "Battery 12V", category: "Electrical", sku: "BT-301", price: 129.99, stock: 8, minStock: 5 },
  { id: "6", name: "Wiper Blades", category: "Accessories", sku: "WB-401", price: 34.99, stock: 30, minStock: 10 },
  { id: "7", name: "Transmission Fluid", category: "Fluids & Lubricants", sku: "TF-501", price: 18.99, stock: 50, minStock: 15 },
  { id: "8", name: "Brake Rotors", category: "Brakes", sku: "BR-102", price: 149.99, stock: 4, minStock: 6 },
];

export default function Parts() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredParts = mockParts.filter((part) => {
    const matchesSearch = `${part.name} ${part.sku}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || part.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const stats = {
    totalParts: mockParts.length,
    totalValue: mockParts.reduce((sum, p) => sum + p.price * p.stock, 0),
    lowStock: mockParts.filter((p) => p.stock <= p.minStock).length,
    categories: Array.from(new Set(mockParts.map((p) => p.category))).length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Parts Sales</h1>
          <p className="text-muted-foreground">Manage and sell car parts inventory</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-add-part">
          <Plus className="h-4 w-4 mr-2" />
          Add Part
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Parts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.totalParts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">${stats.totalValue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-red-600 dark:text-red-400">{stats.lowStock}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{stats.categories}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search parts by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-category-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="engine">Engine Parts</SelectItem>
            <SelectItem value="brakes">Brakes</SelectItem>
            <SelectItem value="filters">Filters</SelectItem>
            <SelectItem value="electrical">Electrical</SelectItem>
            <SelectItem value="fluids">Fluids & Lubricants</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredParts.map((part) => (
          <PartCard
            key={part.id}
            part={part}
            onView={(id) => toast({ title: "View Part", description: `Viewing part details #${id}` })}
            onAddToSale={(id) => toast({ title: "Added to Sale", description: `Part #${id} added to current sale` })}
          />
        ))}
      </div>

      {filteredParts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No parts found matching your criteria.</p>
        </div>
      )}

      <PartFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => toast({ title: "Part Added", description: `${data.name} added to inventory` })}
      />
    </div>
  );
}
