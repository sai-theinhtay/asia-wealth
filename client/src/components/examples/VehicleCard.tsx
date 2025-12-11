import { VehicleCard } from "../VehicleCard";

// todo: remove mock functionality
const mockVehicle = {
  id: "1",
  make: "Toyota",
  model: "Camry",
  year: 2024,
  price: 28500,
  mileage: 12500,
  status: "available" as const,
};

export default function VehicleCardExample() {
  return (
    <VehicleCard
      vehicle={mockVehicle}
      onView={(id) => console.log("View vehicle:", id)}
      onEdit={(id) => console.log("Edit vehicle:", id)}
    />
  );
}
