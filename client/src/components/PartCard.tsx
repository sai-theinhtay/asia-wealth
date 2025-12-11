import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart } from "lucide-react";

interface Part {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  minStock: number;
}

interface PartCardProps {
  part: Part;
  onAddToSale?: (id: string) => void;
  onView?: (id: string) => void;
}

export function PartCard({ part, onAddToSale, onView }: PartCardProps) {
  const isLowStock = part.stock <= part.minStock;

  return (
    <Card data-testid={`part-card-${part.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
            <Package className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{part.name}</h3>
            <p className="text-sm text-muted-foreground">{part.category}</p>
            <p className="text-xs text-muted-foreground font-mono">SKU: {part.sku}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-semibold">${part.price.toFixed(2)}</span>
          <Badge
            className={`border-0 ${
              isLowStock
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            }`}
          >
            {part.stock} in stock
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onView?.(part.id)}
          data-testid={`button-view-part-${part.id}`}
        >
          View Details
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => onAddToSale?.(part.id)}
          disabled={part.stock === 0}
          data-testid={`button-sell-part-${part.id}`}
        >
          <ShoppingCart className="h-3 w-3 mr-2" />
          Sell
        </Button>
      </CardFooter>
    </Card>
  );
}
