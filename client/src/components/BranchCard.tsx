import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Users, Car, Settings } from "lucide-react";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  employeeCount: number;
  vehicleCount: number;
  status: "active" | "inactive";
}

interface BranchCardProps {
  branch: Branch;
  onManage?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function BranchCard({ branch, onManage, onViewDetails }: BranchCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`branch-card-${branch.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-semibold">{branch.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {branch.address}
            </p>
          </div>
          <Badge
            className={`border-0 ${
              branch.status === "active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {branch.status}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{branch.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>Manager: {branch.manager}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{branch.employeeCount} staff</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Car className="h-3 w-3" />
            <span>{branch.vehicleCount} vehicles</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(branch.id)}
            data-testid={`button-view-branch-${branch.id}`}
          >
            View Details
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onManage?.(branch.id)}
            data-testid={`button-manage-branch-${branch.id}`}
          >
            <Settings className="h-3 w-3 mr-2" />
            Manage
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
