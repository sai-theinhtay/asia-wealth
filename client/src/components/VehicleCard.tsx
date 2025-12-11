import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Eye, Edit, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  status: "available" | "reserved" | "sold";
  imageUrl?: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const statusColors = {
  available: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  reserved: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  sold: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export function VehicleCard({ vehicle, onView, onEdit }: VehicleCardProps) {
  return (
    <Card className="overflow-hidden" data-testid={`vehicle-card-${vehicle.id}`}>
      <div className="aspect-[4/3] bg-muted flex items-center justify-center relative">
        {vehicle.imageUrl ? (
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="object-cover w-full h-full"
          />
        ) : (
          <Car className="h-12 w-12 text-muted-foreground/50" />
        )}
        <Badge
          className={`absolute top-2 right-2 ${statusColors[vehicle.status]} border-0`}
        >
          {vehicle.status}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
            <p className="text-sm text-muted-foreground">{vehicle.mileage.toLocaleString()} miles</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid={`button-menu-${vehicle.id}`}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(vehicle.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(vehicle.id)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2">
        <span className="text-lg font-semibold">${vehicle.price.toLocaleString()}</span>
        <Button size="sm" onClick={() => onView?.(vehicle.id)} data-testid={`button-view-${vehicle.id}`}>
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
