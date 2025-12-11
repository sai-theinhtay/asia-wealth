import { RevenueChart } from "../RevenueChart";

// todo: remove mock functionality
const mockData = [
  { name: "Jan", sales: 45000, service: 12000 },
  { name: "Feb", sales: 52000, service: 14000 },
  { name: "Mar", sales: 48000, service: 16000 },
  { name: "Apr", sales: 61000, service: 15000 },
  { name: "May", sales: 55000, service: 18000 },
  { name: "Jun", sales: 67000, service: 20000 },
];

export default function RevenueChartExample() {
  return <RevenueChart data={mockData} />;
}
