import { RecentActivities } from "../RecentActivities";

// todo: remove mock functionality
const mockActivities = [
  { id: "1", type: "sale" as const, title: "Vehicle Sold", description: "2024 Toyota Camry - John Smith", time: "2h ago" },
  { id: "2", type: "service" as const, title: "Service Completed", description: "Oil change - Honda Accord", time: "3h ago" },
  { id: "3", type: "member" as const, title: "New Member", description: "Sarah Johnson registered", time: "5h ago" },
  { id: "4", type: "payment" as const, title: "Payment Received", description: "$2,500 - Service invoice", time: "6h ago" },
];

export default function RecentActivitiesExample() {
  return <RecentActivities activities={mockActivities} />;
}
