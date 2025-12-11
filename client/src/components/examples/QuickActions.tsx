import { QuickActions } from "../QuickActions";

export default function QuickActionsExample() {
  return (
    <QuickActions
      onNewSale={() => console.log("New sale clicked")}
      onNewService={() => console.log("New service clicked")}
      onNewMember={() => console.log("New member clicked")}
      onAddVehicle={() => console.log("Add vehicle clicked")}
    />
  );
}
