import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Car, Wrench, Users } from "lucide-react";

interface QuickActionsProps {
  onNewSale?: () => void;
  onNewService?: () => void;
  onNewMember?: () => void;
  onAddVehicle?: () => void;
}

export function QuickActions({ onNewSale, onNewService, onNewMember, onAddVehicle }: QuickActionsProps) {
  return (
    <Card data-testid="quick-actions">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={onNewSale}
            data-testid="button-new-sale"
          >
            <Car className="h-5 w-5" />
            <span className="text-sm">New Sale</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={onNewService}
            data-testid="button-new-service"
          >
            <Wrench className="h-5 w-5" />
            <span className="text-sm">Schedule Service</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={onAddVehicle}
            data-testid="button-add-vehicle"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm">Add Vehicle</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2"
            onClick={onNewMember}
            data-testid="button-new-member"
          >
            <Users className="h-5 w-5" />
            <span className="text-sm">New Member</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
