import { ServiceTable } from "../ServiceTable";

// todo: remove mock functionality
const mockAppointments = [
  { id: "1", vehicle: "2023 Honda Accord", customer: "John Smith", service: "Oil Change", date: "Dec 8, 2025", status: "completed" as const, amount: 85 },
  { id: "2", vehicle: "2022 Toyota RAV4", customer: "Jane Doe", service: "Brake Service", date: "Dec 9, 2025", status: "in-progress" as const, amount: 450 },
  { id: "3", vehicle: "2024 Ford F-150", customer: "Mike Wilson", service: "Full Inspection", date: "Dec 10, 2025", status: "pending" as const, amount: 150 },
];

export default function ServiceTableExample() {
  return (
    <ServiceTable
      appointments={mockAppointments}
      onView={(id) => console.log("View service:", id)}
      onEdit={(id) => console.log("Edit service:", id)}
    />
  );
}
